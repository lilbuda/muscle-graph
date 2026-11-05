import createMuscleGraph, {
  ADVANCED_MUSCLES, MuscleType, getMuscleLabel,
  type BodyType, type ExerciseData, type MuscleGraphOptions,
} from '../../src/index.js';
import { codeBlock } from './html.js';

export interface ShowcaseController {
  setTheme(): void;
  destroy(): void;
}

export function mountShowcase(root: HTMLElement): ShowcaseController | undefined {
  const front = root.querySelector<HTMLElement>('#anterior-map');
  const back = root.querySelector<HTMLElement>('#posterior-map');
  if (!front || !back) return undefined;
  const abort = new AbortController();
  const status = root.querySelector<HTMLElement>('#map-status');
  const picker = root.querySelector<HTMLSelectElement>('#map-muscle-select');
  const preset = root.querySelector<HTMLSelectElement>('#workout-preset');
  const configuration = root.querySelector<HTMLElement>('#configuration-code');
  let bodyType: BodyType = 'male';
  let selected: MuscleType | undefined;
  let colors: Pick<MuscleGraphOptions, 'bodyColor' | 'bodyFillColor' | 'bodyOutlineColor' | 'outlineColor' | 'hoverColor'> = {};
  let customColors: typeof colors = {};
  const presets: Readonly<Record<string, readonly ExerciseData[]>> = {
    upper: [{ name: 'Bench press', muscles: ['chest'], frequency: 3 }, { name: 'Triceps extension', muscles: ['triceps'], frequency: 1 }],
    lower: [{ name: 'Squat', muscles: ['quadriceps', 'gluteal'], frequency: 3 }, { name: 'Calf raise', muscles: ['calves'], frequency: 2 }],
    full: [{ name: 'Full-body workout', muscles: ['chest', 'upper-back', 'quadriceps', 'gluteal', 'calves'], frequency: 2 }],
    empty: [],
  };
  const choose = (muscle: MuscleType): void => {
    selected = selected === muscle ? undefined : muscle;
    if (picker) picker.value = selected ?? '';
    render();
  };
  const graphs = [
    createMuscleGraph({ container: front, type: 'anterior', onClick: ({ muscle }) => choose(muscle) }),
    createMuscleGraph({ container: back, type: 'posterior', onClick: ({ muscle }) => choose(muscle) }),
  ];
  const colorInputs = [
    ['#map-muscle-color', 'bodyColor'], ['#map-fill-color', 'bodyFillColor'],
    ['#map-outline-color', 'bodyOutlineColor'], ['#map-border-color', 'outlineColor'],
    ['#map-highlight-color', 'hoverColor'],
  ] as const;

  function render(): void {
    const data = selected ? [{ name: 'Selected muscle', muscles: [selected], frequency: 3 }] : presets[preset?.value ?? 'upper'] ?? [];
    for (const [index, graph] of graphs.entries()) {
      graph.update({ ...colors, bodyType, data,
        highlightedColors: [colors.hoverColor ?? '#b55e43'],
        ariaLabel: `${bodyType === 'male' ? 'Male' : 'Female'} ${index === 0 ? 'anterior' : 'posterior'} muscle map`,
      });
    }
    for (const button of root.querySelectorAll<HTMLButtonElement>('[data-body]')) {
      button.setAttribute('aria-pressed', String(button.dataset.body === bodyType));
    }
    if (status) status.textContent = selected ? getMuscleLabel(selected) : 'Select a muscle to see its name.';
    if (configuration) {
      const options = { bodyType, type: 'anterior', ...colors, highlightedColors: [colors.hoverColor], data };
      configuration.innerHTML = codeBlock(`import createMuscleGraph from 'muscle-graph';\n\nconst host = document.querySelector<HTMLElement>('#body-map');\nif (!host) throw new Error('Missing #body-map');\n\nconst graph = createMuscleGraph({\n  container: host,\n${JSON.stringify(options, null, 2).slice(2, -2).split('\n').map(line => `  ${line}`).join('\n')}\n});`);
    }
  }

  function setTheme(): void {
    const style = getComputedStyle(document.documentElement);
    colors = {
      bodyColor: style.getPropertyValue('--map-muscle').trim(),
      bodyFillColor: 'transparent',
      bodyOutlineColor: style.getPropertyValue('--map-outline').trim(),
      outlineColor: style.getPropertyValue('--bg').trim(),
      hoverColor: style.getPropertyValue('--map-highlight').trim(),
      ...customColors,
    };
    for (const [selector, property] of colorInputs) {
      const input = root.querySelector<HTMLInputElement>(selector);
      if (input) input.value = colors[property] === 'transparent' ? style.getPropertyValue('--bg').trim() : colors[property] ?? '#ffffff';
    }
    render();
  }

  if (picker) {
    const muscles = [...ADVANCED_MUSCLES, MuscleType.HANDS, MuscleType.FEET, MuscleType.HEAD, MuscleType.HAIR, MuscleType.NECK, MuscleType.KNEES, MuscleType.ANKLES];
    for (const muscle of muscles.sort((a, b) => getMuscleLabel(a).localeCompare(getMuscleLabel(b)))) {
      const option = document.createElement('option');
      option.value = muscle;
      option.textContent = getMuscleLabel(muscle);
      picker.append(option);
    }
    picker.addEventListener('change', () => { selected = picker.value as MuscleType || undefined; render(); }, { signal: abort.signal });
  }
  for (const button of root.querySelectorAll<HTMLButtonElement>('[data-body]')) {
    button.addEventListener('click', () => { bodyType = button.dataset.body as BodyType; render(); }, { signal: abort.signal });
  }
  preset?.addEventListener('change', () => { selected = undefined; if (picker) picker.value = ''; render(); }, { signal: abort.signal });
  root.querySelector('#clear-selection')?.addEventListener('click', () => { selected = undefined; if (picker) picker.value = ''; render(); }, { signal: abort.signal });
  for (const [selector, property] of colorInputs) {
    const input = root.querySelector<HTMLInputElement>(selector);
    input?.addEventListener('input', () => {
      customColors = { ...customColors, [property]: input.value };
      colors = { ...colors, [property]: input.value };
      render();
    }, { signal: abort.signal });
  }
  setTheme();
  return { setTheme, destroy(): void { abort.abort(); for (const graph of graphs) graph.destroy(); } };
}
