import { createModelSvg } from './model.js';
import { ADVANCED_MUSCLES, getMuscleLabel, getMuscleParents, MUSCLES, MuscleType, resolveMuscle } from './muscles.js';
import { calculateMuscleStats, toMuscleStats } from './stats.js';
import { baseStyles } from './styles.js';
import type {
  BodyType,
  ExerciseData,
  ModelType,
  MuscleData,
  MuscleGraphInstance,
  MuscleGraphOptions,
  MuscleInput,
  MuscleStats,
  StyleMap,
} from './types.js';

const DEFAULT_COLORS = Object.freeze(['#93c5fd', '#3b82f6', '#1d4ed8']);

interface ResolvedOptions {
  readonly container?: HTMLElement;
  readonly data: readonly ExerciseData[];
  readonly type: ModelType;
  readonly bodyType: BodyType;
  readonly bodyColor: string;
  readonly bodyFillColor: string;
  readonly highlightedColors: readonly string[];
  readonly muscleColors: Partial<Readonly<Record<MuscleType, string>>>;
  readonly outlineColor: string;
  readonly bodyOutlineColor: string;
  readonly hoverColor: string;
  readonly backgroundColor: string;
  readonly wrapperClassName: string;
  readonly style: StyleMap;
  readonly svgStyle: StyleMap;
  readonly ariaLabel: string;
  readonly onClick?: (stats: MuscleStats) => void;
  readonly onMouseEnter?: (stats: MuscleStats) => void;
  readonly onMouseLeave?: (stats: MuscleStats) => void;
}

const defaults: ResolvedOptions = {
  data: Object.freeze([]) as readonly ExerciseData[],
  type: 'anterior' as ModelType,
  bodyType: 'male' as BodyType,
  bodyColor: '#879297',
  bodyFillColor: 'transparent',
  highlightedColors: DEFAULT_COLORS,
  muscleColors: Object.freeze({}),
  outlineColor: '#ffffff',
  bodyOutlineColor: '#dfdfdf',
  hoverColor: '#dc2626',
  backgroundColor: 'transparent',
  wrapperClassName: 'mg-wrapper',
  style: Object.freeze({}),
  svgStyle: Object.freeze({}),
  ariaLabel: 'Interactive muscle map',
} as const;

export function createMuscleGraph(initialOptions: MuscleGraphOptions = {}): MuscleGraphInstance {
  const document = initialOptions.container?.ownerDocument ?? globalThis.document;
  if (!document) throw new Error('createMuscleGraph requires a DOM. Create the graph after the host element mounts.');
  let options = mergeOptions(defaults, initialOptions);
  let stats = calculateMuscleStats(options.data);
  let destroyed = false;

  const element = document.createElement('div');
  const stylesheet = document.createElement('style');
  stylesheet.dataset.muscleGraphStyles = '';
  stylesheet.textContent = baseStyles;
  element.append(stylesheet);

  const getTargetMuscle = (target: EventTarget | null): MuscleType | undefined => {
    if (!target || !('nodeType' in target) || target.nodeType !== 1) return undefined;
    const group = (target as Element).closest<SVGGElement>('[data-muscle]');
    if (group?.closest('.mg-wrapper') !== element) return undefined;
    const value = group.dataset.muscle;
    return value ? resolveMuscle(value) : undefined;
  };

  const emit = (callback: MuscleGraphOptions['onClick'], event: Event): void => {
    const muscle = getTargetMuscle(event.target);
    if (muscle) callback?.(toMuscleStats(muscle, stats));
  };

  const onClick = (event: MouseEvent): void => emit(options.onClick, event);
  const onMouseOver = (event: MouseEvent): void => {
    const muscle = getTargetMuscle(event.target);
    const related = getTargetMuscle(event.relatedTarget);
    if (muscle && muscle !== related) options.onMouseEnter?.(toMuscleStats(muscle, stats));
  };
  const onMouseOut = (event: MouseEvent): void => {
    const muscle = getTargetMuscle(event.target);
    const related = getTargetMuscle(event.relatedTarget);
    if (muscle && muscle !== related) options.onMouseLeave?.(toMuscleStats(muscle, stats));
  };
  const onKeyDown = (event: KeyboardEvent): void => {
    if (event.repeat || (event.key !== 'Enter' && event.key !== ' ')) return;
    if (!getTargetMuscle(event.target)) return;
    event.preventDefault();
    emit(options.onClick, event);
  };

  element.addEventListener('click', onClick);
  element.addEventListener('mouseover', onMouseOver);
  element.addEventListener('mouseout', onMouseOut);
  element.addEventListener('keydown', onKeyDown);

  const render = (): void => {
    const focusedMuscle = document.activeElement?.closest('.mg-wrapper') === element
      ? document.activeElement.closest<SVGGElement>('[data-muscle]')?.dataset.muscle
      : undefined;
    let svg = element.querySelector<SVGSVGElement>('.mg-svg');
    if (!svg || svg.dataset.bodyType !== options.bodyType || svg.dataset.type !== options.type) {
      const nextSvg = createModelSvg(options.bodyType, options.type, options.ariaLabel, document);
      if (svg) svg.replaceWith(nextSvg);
      else element.append(nextSvg);
      svg = nextSvg;
    }
    svg.setAttribute('aria-label', options.ariaLabel);
    element.className = options.wrapperClassName;
    element.classList.add('mg-wrapper');
    resetStyle(element.style);
    applyStyle(element.style, options.style);
    element.style.setProperty('--mg-body-color', options.bodyColor);
    element.style.setProperty('--mg-body-fill-color', options.bodyFillColor);
    element.style.setProperty('--mg-outline-color', options.outlineColor);
    element.style.setProperty('--mg-body-outline-color', options.bodyOutlineColor);
    element.style.setProperty('--mg-hover-color', options.hoverColor);
    element.style.setProperty('--mg-background-color', options.backgroundColor);

    resetStyle(svg.style);
    applyStyle(svg.style, options.svgStyle);
    for (const group of svg.querySelectorAll<SVGGElement>('[data-muscle]')) {
      const muscle = resolveMuscle(group.dataset.muscle ?? '');
      if (!muscle) continue;
      const muscleStats = stats.get(muscle);
      const frequency = muscleStats?.frequency ?? 0;
      const paletteIndex = Math.max(0, Math.min(Math.ceil(frequency) - 1, options.highlightedColors.length - 1));
      const parentColor = getMuscleParents(muscle).map((parent) => options.muscleColors[parent]).find((color) => color !== undefined);
      const color = options.muscleColors[muscle] ?? parentColor
        ?? (frequency > 0 ? options.highlightedColors[paletteIndex] : undefined)
        ?? options.bodyColor;
      group.style.setProperty('--mg-fill', color);
      group.setAttribute('aria-label', `${getMuscleLabel(muscle)}: ${frequency} ${frequency === 1 ? 'set' : 'sets'}`);
      group.setAttribute('aria-pressed', String(frequency > 0));
      group.dataset.frequency = String(frequency);
    }
    if (focusedMuscle) svg.querySelector<SVGGElement>(`[data-muscle="${focusedMuscle}"]`)?.focus({ preventScroll: true });
  };

  render();
  initialOptions.container?.append(element);

  return {
    element,
    update(nextOptions): void {
      if (destroyed) return;
      options = mergeOptions(options, nextOptions);
      if (nextOptions.data !== undefined) stats = calculateMuscleStats(options.data);
      render();
    },
    destroy(): void {
      if (destroyed) return;
      element.removeEventListener('click', onClick);
      element.removeEventListener('mouseover', onMouseOver);
      element.removeEventListener('mouseout', onMouseOut);
      element.removeEventListener('keydown', onKeyDown);
      element.remove();
      destroyed = true;
    },
    getStats(muscleInput): MuscleStats | undefined {
      const muscle = resolveMuscle(muscleInput);
      return muscle ? toMuscleStats(muscle, stats) : undefined;
    },
  };
}

function mergeOptions(
  current: ResolvedOptions,
  next: Partial<MuscleGraphOptions>,
): ResolvedOptions {
  const muscleColors = { ...current.muscleColors };
  for (const muscle of MUSCLES) {
    const color = next.muscleColors?.[muscle];
    if (color === null) delete muscleColors[muscle];
    else if (color !== undefined) muscleColors[muscle] = color;
  }
  const merged: ResolvedOptions = {
    ...current,
    ...next,
    data: next.data ?? current.data,
    highlightedColors: next.highlightedColors?.length ? next.highlightedColors : current.highlightedColors,
    muscleColors,
    style: next.style ?? current.style,
    svgStyle: next.svgStyle ?? current.svgStyle,
  };
  if (merged.bodyType !== 'male' && merged.bodyType !== 'female') throw new RangeError('bodyType must be male or female.');
  if (merged.type !== 'anterior' && merged.type !== 'posterior') throw new RangeError('type must be anterior or posterior.');
  return merged;
}

const unitlessStyles = new Set(['opacity', 'z-index', 'font-weight', 'line-height', 'flex-grow', 'flex-shrink', 'order', 'stroke-width', 'fill-opacity', 'stroke-opacity', 'scale', 'aspect-ratio']);

function applyStyle(target: CSSStyleDeclaration, styles: StyleMap): void {
  for (const [property, value] of Object.entries(styles)) {
    const normalized = property.startsWith('--') ? property : property.replace(/[A-Z]/g, (letter) => `-${letter.toLowerCase()}`);
    target.setProperty(normalized, typeof value === 'number' && value !== 0 && !normalized.startsWith('--') && !unitlessStyles.has(normalized) ? `${value}px` : String(value));
  }
}

function resetStyle(style: CSSStyleDeclaration): void {
  style.cssText = '';
}

export { ADVANCED_MUSCLES, calculateMuscleStats, getMuscleLabel, MUSCLES, MuscleType, resolveMuscle };
export default createMuscleGraph;
export type {
  BodyType,
  ExerciseData,
  ModelType,
  MuscleData,
  MuscleGraphInstance,
  MuscleGraphOptions,
  MuscleInput,
  MuscleStats,
  StyleMap,
};
