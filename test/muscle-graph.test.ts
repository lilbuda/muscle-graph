import { describe, expect, it, vi } from 'vitest';
import createMuscleGraph, {
  calculateMuscleStats,
  MuscleType,
  resolveMuscle,
  type MuscleGraphOptions,
  type MuscleStats,
} from '../src';

describe('muscle-graph', () => {
  it('reuses geometry for data and theme updates and replaces it for view changes', () => {
    const graph = createMuscleGraph({ svgStyle: { opacity: 0.4 } });
    const svg = graph.element.querySelector('svg');
    const path = graph.element.querySelector('.mg-muscle-part');
    graph.update({ data: [{ name: 'Press', muscles: ['chest'] }], bodyColor: 'teal', svgStyle: {} });
    expect(graph.element.querySelector('svg')).toBe(svg);
    expect(graph.element.querySelector('.mg-muscle-part')).toBe(path);
    expect(svg?.style.opacity).toBe('');
    graph.update({ type: 'posterior' });
    expect(graph.element.querySelector('svg')).not.toBe(svg);
    graph.destroy();
  });

  it('clears individual muscle overrides back to their parent color or palette', () => {
    const graph = createMuscleGraph({
      data: [{ name: 'Press', muscles: ['chest'] }], highlightedColors: ['orange'],
      muscleColors: { chest: 'red', 'upper-pectoralis': 'blue' },
    });
    graph.update({ muscleColors: { 'upper-pectoralis': null } });
    expect(getRegion(graph.element, MuscleType.UPPER_PECTORALIS).style.getPropertyValue('--mg-fill')).toBe('red');
    graph.update({ muscleColors: { chest: null } });
    expect(getRegion(graph.element, MuscleType.UPPER_PECTORALIS).style.getPropertyValue('--mg-fill')).toBe('orange');
    graph.destroy();
  });

  it('handles unitless numeric styles and CSS variables', () => {
    const graph = createMuscleGraph({ style: { opacity: 0.5, width: 280, '--level': 2, lineHeight: 1.2 } });
    expect(graph.element.style.opacity).toBe('0.5');
    expect(graph.element.style.width).toBe('280px');
    expect(graph.element.style.lineHeight).toBe('1.2');
    expect(graph.element.style.getPropertyValue('--level')).toBe('2');
    graph.destroy();
  });

  it('scopes events to their own graph when maps are nested', () => {
    const outerClick = vi.fn();
    const innerClick = vi.fn();
    const outer = createMuscleGraph({ container: document.body, onClick: outerClick });
    const inner = createMuscleGraph({ container: outer.element, onClick: innerClick });
    getRegion(inner.element, MuscleType.UPPER_PECTORALIS).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(innerClick).toHaveBeenCalledOnce();
    expect(outerClick).not.toHaveBeenCalled();
    const focused = getRegion(inner.element, MuscleType.HANDS);
    focused.focus();
    outer.update({ bodyColor: 'teal' });
    expect(document.activeElement).toBe(focused);
    inner.destroy();
    outer.destroy();
  });

  it('renders into an iframe document and handles its elements', () => {
    const frame = document.createElement('iframe');
    document.body.append(frame);
    const frameDocument = frame.contentDocument;
    if (!frameDocument) throw new Error('Missing iframe document');
    const onClick = vi.fn();
    const graph = createMuscleGraph({ container: frameDocument.body, onClick });
    expect(graph.element.ownerDocument).toBe(frameDocument);
    expect(graph.element.querySelector('svg')?.ownerDocument).toBe(frameDocument);
    getRegion(graph.element, MuscleType.HANDS).dispatchEvent(new MouseEvent('click', { bubbles: true }));
    expect(onClick).toHaveBeenCalledOnce();
    graph.destroy();
    frame.remove();
  });

  it('reports a clear error when creating a map without a DOM', () => {
    vi.stubGlobal('document', undefined);
    try {
      expect(() => createMuscleGraph()).toThrow('requires a DOM');
    } finally {
      vi.unstubAllGlobals();
    }
  });

  it('ignores inherited object properties as muscle names', () => {
    expect(resolveMuscle('constructor')).toBeUndefined();
    expect(resolveMuscle('toString')).toBeUndefined();
    expect(resolveMuscle('__proto__')).toBeUndefined();
    expect(resolveMuscle('prototype')).toBeUndefined();
  });

  it('keeps hostile input as data across creation and updates in every view', () => {
    const payload = '\"><img src=x onerror=alert(1)><svg onload=alert(1)>';
    for (const bodyType of ['male', 'female'] as const) {
      for (const type of ['anterior', 'posterior'] as const) {
        const onClick = vi.fn();
        const graph = createMuscleGraph({
          bodyType, type, onClick,
          ariaLabel: payload,
          wrapperClassName: payload,
          bodyColor: 'red; --mg-injected: 1',
          data: [{ name: payload, muscles: ['chest', '__proto__', 'constructor', payload] }],
        });
        try {
          expect(graph.getStats('chest')?.data.exercises).toEqual([payload]);
          expect(graph.element.querySelector('svg')?.getAttribute('aria-label')).toBe(payload);
          const assertSafeMarkup = (): void => {
            expect(graph.element.querySelector('script, img, foreignObject, iframe')).toBeNull();
            expect(graph.element.style.getPropertyValue('--mg-injected')).toBe('');
            for (const node of graph.element.querySelectorAll('*')) {
              expect([...node.attributes].some(attribute => /^on/i.test(attribute.name))).toBe(false);
            }
          };
          assertSafeMarkup();
          graph.update({
            ariaLabel: payload,
            bodyColor: payload,
            muscleColors: JSON.parse('{"__proto__":{"polluted":true},"chest":"red; --mg-injected: 1"}') as NonNullable<MuscleGraphOptions['muscleColors']>,
            data: [{ name: payload, muscles: ['hands', payload] }],
          });
          expect(Object.hasOwn(Object.prototype, 'polluted')).toBe(false);
          expect(graph.getStats(payload)).toBeUndefined();
          getRegion(graph.element, MuscleType.HANDS).dispatchEvent(new MouseEvent('click', { bubbles: true }));
          expect(onClick).toHaveBeenLastCalledWith({
            muscle: MuscleType.HANDS,
            data: { exercises: [payload], frequency: 1 },
          });
          assertSafeMarkup();
        } finally {
          graph.destroy();
        }
      }
    }
  });

  it('uses a valid palette bucket for fractional frequencies', () => {
    const graph = createMuscleGraph({ data: [{ name: 'Press', muscles: ['chest'], frequency: 1.5 }], highlightedColors: ['red', 'blue'] });
    expect(getRegion(graph.element, MuscleType.UPPER_PECTORALIS).style.getPropertyValue('--mg-fill')).toBe('blue');
    expect(graph.getStats('chest')?.data.frequency).toBe(1.5);
    graph.destroy();
  });

  it('ignores repeated keyboard activation while a key is held', () => {
    const onClick = vi.fn();
    const graph = createMuscleGraph({ onClick });
    getRegion(graph.element, MuscleType.HANDS).dispatchEvent(new KeyboardEvent('keydown', { key: ' ', repeat: true, bubbles: true }));
    expect(onClick).not.toHaveBeenCalled();
    graph.destroy();
  });

  it('renders a configurable body outline separately from muscle separators', () => {
    const graph = createMuscleGraph();
    expect(graph.element.style.getPropertyValue('--mg-body-outline-color')).toBe('#dfdfdf');
    expect(graph.element.style.getPropertyValue('--mg-outline-color')).toBe('#ffffff');
    expect(graph.element.style.getPropertyValue('--mg-body-fill-color')).toBe('transparent');
    for (const bodyType of ['male', 'female'] as const) for (const type of ['anterior', 'posterior'] as const) {
      graph.update({ bodyType, type, bodyOutlineColor: '#667788', bodyFillColor: '#e0eef5' });
      const outline = graph.element.querySelector('.mg-outline');
      expect(outline?.getAttribute('d')?.length).toBeGreaterThan(0);
      expect(outline?.getAttribute('vector-effect')).toBe('non-scaling-stroke');
      expect(outline?.getAttribute('aria-hidden')).toBe('true');
      expect(graph.element.style.getPropertyValue('--mg-body-outline-color')).toBe('#667788');
      expect(graph.element.style.getPropertyValue('--mg-outline-color')).toBe('#ffffff');
      expect(graph.element.style.getPropertyValue('--mg-body-fill-color')).toBe('#e0eef5');
    }
    graph.update({ bodyOutlineColor: 'none', bodyFillColor: 'transparent' });
    expect(graph.element.style.getPropertyValue('--mg-body-outline-color')).toBe('none');
    expect(graph.element.style.getPropertyValue('--mg-body-fill-color')).toBe('transparent');
    graph.destroy();
  });

  it('renders an accessible male anterior model into a container', () => {
    const container = document.createElement('div');
    const graph = createMuscleGraph({ container });
    const svg = container.querySelector('svg');

    expect(graph.element.parentElement).toBe(container);
    expect(svg?.dataset.bodyType).toBe('male');
    expect(svg?.dataset.type).toBe('anterior');
    expect(svg?.getAttribute('aria-label')).toBe('Interactive muscle map');
    expect(container.querySelector('[data-muscle="upper-pectoralis"]')?.getAttribute('tabindex')).toBe('0');
  });

  it('expands broad exercise inputs and de-duplicates parent/child references', () => {
    const stats = calculateMuscleStats([
      { name: 'Press', muscles: [MuscleType.CHEST, MuscleType.UPPER_PECTORALIS], frequency: 3 },
      { name: 'Incline press', muscles: [MuscleType.UPPER_PECTORALIS] },
    ]);
    expect(stats.get(MuscleType.CHEST)?.frequency).toBe(4);
    expect(stats.get(MuscleType.UPPER_PECTORALIS)?.frequency).toBe(4);
    expect(stats.get(MuscleType.MID_LOWER_PECTORALIS)?.frequency).toBe(3);
  });

  it('calculates frequencies, de-duplicates muscles per exercise, and resolves aliases', () => {
    const stats = calculateMuscleStats([
      { name: 'Bench press', muscles: ['Pectoralis Major', 'chest', MuscleType.TRICEPS], frequency: 3 },
      { name: 'Push up', muscles: ['pecs'] },
      { name: 'Unknown', muscles: ['not-a-muscle'] },
    ]);

    expect(stats.get(MuscleType.CHEST)).toEqual({ exercises: ['Bench press', 'Push up'], frequency: 4 });
    expect(stats.get(MuscleType.TRICEPS)?.frequency).toBe(3);
    expect(resolveMuscle('Erector_Spinae')).toBe(MuscleType.LOWER_BACK);
    expect(resolveMuscle('not-a-muscle')).toBeUndefined();
  });

  it('applies frequency palettes and per-muscle overrides', () => {
    const graph = createMuscleGraph({
      data: [
        { name: 'Bench press', muscles: [MuscleType.CHEST], frequency: 2 },
        { name: 'Curl', muscles: [MuscleType.BICEPS] },
      ],
      highlightedColors: ['#111111', '#222222'],
      muscleColors: { [MuscleType.BICEPS]: '#abcdef', [MuscleType.LONG_HEAD_BICEPS]: '#123456' },
    });

    expect(getRegion(graph.element, MuscleType.UPPER_PECTORALIS).style.getPropertyValue('--mg-fill')).toBe('#222222');
    expect(getRegion(graph.element, MuscleType.MID_LOWER_PECTORALIS).style.getPropertyValue('--mg-fill')).toBe('#222222');
    expect(getRegion(graph.element, MuscleType.LONG_HEAD_BICEPS).style.getPropertyValue('--mg-fill')).toBe('#123456');
    expect(getRegion(graph.element, MuscleType.SHORT_HEAD_BICEPS).style.getPropertyValue('--mg-fill')).toBe('#abcdef');
    expect(getRegion(graph.element, MuscleType.UPPER_ABDOMINALS).style.getPropertyValue('--mg-fill')).toBe('#879297');
  });

  it('supports pointer and keyboard activation', () => {
    const onClick = vi.fn<(stats: MuscleStats) => void>();
    const graph = createMuscleGraph({
      data: [{ name: 'Push up', muscles: [MuscleType.CHEST] }],
      onClick,
    });
    const chest = getRegion(graph.element, MuscleType.UPPER_PECTORALIS);

    chest.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    chest.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));

    expect(onClick).toHaveBeenCalledTimes(2);
    expect(onClick).toHaveBeenLastCalledWith({
      muscle: MuscleType.UPPER_PECTORALIS,
      data: { exercises: ['Push up'], frequency: 1 },
    });
  });

  it('updates the view and body type without replacing the root', () => {
    const graph = createMuscleGraph({ wrapperClassName: 'custom-map' });
    const root = graph.element;

    graph.update({ bodyType: 'female', type: 'posterior', ariaLabel: 'Back muscles' });

    expect(graph.element).toBe(root);
    expect(root.classList.contains('custom-map')).toBe(true);
    expect(root.querySelector('svg')?.dataset.bodyType).toBe('female');
    expect(root.querySelector('svg')?.dataset.type).toBe('posterior');
    expect(root.querySelector('svg')?.getAttribute('aria-label')).toBe('Back muscles');
  });

  it('retains keyboard focus on a selected region when its data updates', () => {
    const graph = createMuscleGraph({ container: document.body });
    getRegion(graph.element, MuscleType.UPPER_PECTORALIS).focus();
    graph.update({ data: [{ name: 'Press', muscles: [MuscleType.CHEST] }] });
    expect(document.activeElement).toBe(getRegion(graph.element, MuscleType.UPPER_PECTORALIS));
    graph.destroy();
  });

  it('renders distinct male and female proportions', () => {
    const graph = createMuscleGraph();
    for (const type of ['anterior', 'posterior'] as const) {
      graph.update({ type, bodyType: 'male' });
      const malePaths = [...graph.element.querySelectorAll('.mg-muscle-part')].map((path) => path.getAttribute('d'));
      graph.update({ bodyType: 'female' });
      const femalePaths = [...graph.element.querySelectorAll('.mg-muscle-part')].map((path) => path.getAttribute('d'));
      expect(femalePaths).not.toEqual(malePaths);
      expect(graph.element.querySelector('svg')?.getAttribute('viewBox')).toBe(type === 'anterior' ? '-50 -40 734 1538' : '756 0 774 1448');
      expect(graph.element.querySelector('[data-muscle][transform]')).toBeNull();
    }
  });

  for (const type of ['anterior', 'posterior'] as const) {
    it(`aligns female ${type} crown and sole positions with the male frame`, () => {
      const graph = createMuscleGraph({ bodyType: 'female', type });
      const figure = graph.element.querySelector('.mg-figure');
      const values = figure?.getAttribute('transform')?.match(/-?\d+(?:\.\d+)?(?:e[+-]?\d+)?/g)?.map(Number) ?? [];
      const translateY = values[1] ?? NaN;
      const scale = values[2] ?? NaN;
      const viewportScale = type === 'anterior' ? 1448 / 1538 : 724 / 774;
      const viewportOffset = type === 'anterior' ? 40 * viewportScale : (1448 - 1448 * viewportScale) / 2;
      expect((50 * scale + translateY) * viewportScale + viewportOffset).toBeCloseTo(type === 'anterior' ? 96 : 97);
      expect((1429 * scale + translateY) * viewportScale + viewportOffset).toBeCloseTo(type === 'anterior' ? 1340 : 1342);
      const hairTransform = getRegion(graph.element, MuscleType.HAIR).querySelector('g')?.getAttribute('transform');
      expect(hairTransform).toContain('scale(0.8)');
      const headTransform = graph.element.querySelector('[data-muscle="head"] > g')?.getAttribute('transform');
      if (type === 'anterior') expect(headTransform).toBe(hairTransform);
      expect(graph.element.querySelector('.mg-outline[transform]')?.getAttribute('transform')).toBe(hairTransform);
      graph.update({ bodyType: 'male' });
      expect(graph.element.querySelector('.mg-figure')?.hasAttribute('transform')).toBe(false);
      graph.destroy();
    });
  }

  it('keeps hip abduction and adduction data separate in the detailed model', () => {
    const graph = createMuscleGraph({
      data: [
        { name: 'Hip abduction', muscles: [MuscleType.ABDUCTORS], frequency: 2 },
        { name: 'Hip adduction', muscles: [MuscleType.ADDUCTOR] },
      ],
    });
    expect(getRegion(graph.element, MuscleType.INNER_THIGH).dataset.frequency).toBe('1');

    graph.update({ type: 'posterior' });
    expect(getRegion(graph.element, MuscleType.GLUTEUS_MEDIUS).dataset.frequency).toBe('2');
    expect(getRegion(graph.element, MuscleType.INNER_THIGH).dataset.frequency).toBe('1');
  });

  it('returns stats and removes itself on destroy', () => {
    const container = document.createElement('div');
    const graph = createMuscleGraph({
      container,
      data: [{ name: 'Deadlift', muscles: ['glutes'], frequency: 2 }],
    });

    expect(graph.getStats('Gluteus Maximus')?.data.frequency).toBe(2);
    expect(graph.getStats('unknown')).toBeUndefined();
    graph.destroy();
    graph.destroy();
    expect(container.children).toHaveLength(0);
  });

  it('keeps subdivision clips unique across simultaneous maps and updates', () => {
    const graphs = [createMuscleGraph(), createMuscleGraph(), createMuscleGraph({ bodyType: 'female' })];
    graphs[0]?.update({ type: 'posterior' });
    const ids = graphs.flatMap(graph => [...graph.element.querySelectorAll('clipPath')].map(clip => clip.id));
    expect(ids.length).toBeGreaterThan(0);
    expect(new Set(ids).size).toBe(ids.length);
    for (const graph of graphs) {
      for (const part of graph.element.querySelectorAll('[clip-path]')) {
        const id = part.getAttribute('clip-path')?.slice(5, -1);
        expect(graph.element.querySelector(`[id="${id}"]`)).not.toBeNull();
      }
      graph.destroy();
    }
  });

  it('supports the source artwork supplementary hair and ankle groups', () => {
    const onClick = vi.fn<(stats: MuscleStats) => void>();
    const graph = createMuscleGraph({ onClick,
      data: [{ name: 'Ankle work', muscles: [MuscleType.ANKLES], frequency: 2 }],
      muscleColors: { [MuscleType.HAIR]: '#123456' },
    });
    expect(getRegion(graph.element, MuscleType.ANKLES).dataset.frequency).toBe('2');
    const hair = getRegion(graph.element, MuscleType.HAIR);
    expect(hair.style.getPropertyValue('--mg-fill')).toBe('#123456');
    hair.dispatchEvent(new KeyboardEvent('keydown', { key: ' ', bubbles: true }));
    expect(onClick).toHaveBeenLastCalledWith({ muscle: MuscleType.HAIR, data: { exercises: [], frequency: 0 } });
    graph.destroy();
  });

  it('highlights hands and feet and reports their activation in all four views', () => {
    for (const bodyType of ['male', 'female'] as const) for (const type of ['anterior', 'posterior'] as const) {
      const onClick = vi.fn<(stats: MuscleStats) => void>();
      const graph = createMuscleGraph({
        bodyType, type, onClick,
        data: [{ name: 'Grip work', muscles: ['hand'], frequency: 2 }],
        muscleColors: { [MuscleType.HANDS]: '#3b82f6', [MuscleType.FEET]: '#14b8a6' },
      });
      const hands = getRegion(graph.element, MuscleType.HANDS);
      const feet = getRegion(graph.element, MuscleType.FEET);
      expect(hands.querySelectorAll('.mg-muscle-part')).toHaveLength(12);
      expect(feet.querySelectorAll('.mg-muscle-part')).toHaveLength(type === 'anterior' ? 4 : 2);
      if (bodyType === 'male') {
        const female = createMuscleGraph({ bodyType: 'female', type });
        const femaleFeet = getRegion(female.element, MuscleType.FEET);
        expect([...feet.querySelectorAll('path')].map(path => path.getAttribute('d')))
          .toEqual([...femaleFeet.querySelectorAll('path')].map(path => path.getAttribute('d')));
        female.destroy();
      }
      expect(hands.style.getPropertyValue('--mg-fill')).toBe('#3b82f6');
      expect(feet.style.getPropertyValue('--mg-fill')).toBe('#14b8a6');
      hands.querySelector('path')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClick).toHaveBeenLastCalledWith({ muscle: MuscleType.HANDS, data: { exercises: ['Grip work'], frequency: 2 } });
      feet.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', bubbles: true }));
      expect(onClick).toHaveBeenLastCalledWith({ muscle: MuscleType.FEET, data: { exercises: [], frequency: 0 } });
      expect(graph.element.querySelector('.mg-anatomy-detail')).toBeNull();
      graph.destroy();
    }
  });

  it('targets calf heads independently and preserves nested calf inputs and colors', () => {
    for (const bodyType of ['male', 'female'] as const) {
      const onClick = vi.fn<(stats: MuscleStats) => void>();
      const graph = createMuscleGraph({ bodyType, type: 'posterior', onClick,
        data: [{ name: 'Medial calf emphasis', muscles: [MuscleType.GASTROCNEMIUS_MEDIAL_HEAD], frequency: 2 }],
      });
      const medial = getRegion(graph.element, MuscleType.GASTROCNEMIUS_MEDIAL_HEAD);
      const lateral = getRegion(graph.element, MuscleType.GASTROCNEMIUS_LATERAL_HEAD);
      expect(medial.dataset.frequency).toBe('2');
      expect(lateral.dataset.frequency).toBe('0');
      medial.querySelector('path')?.dispatchEvent(new MouseEvent('click', { bubbles: true }));
      expect(onClick).toHaveBeenLastCalledWith({ muscle: MuscleType.GASTROCNEMIUS_MEDIAL_HEAD,
        data: { exercises: ['Medial calf emphasis'], frequency: 2 } });
      graph.update({
        data: [{ name: 'Calf raise', muscles: [MuscleType.CALVES, MuscleType.GASTROCNEMIUS_MEDIAL_HEAD], frequency: 3 }],
        muscleColors: { [MuscleType.CALVES]: '#111111', [MuscleType.GASTROCNEMIUS]: '#222222', [MuscleType.GASTROCNEMIUS_MEDIAL_HEAD]: '#333333' },
      });
      expect(getRegion(graph.element, MuscleType.GASTROCNEMIUS_MEDIAL_HEAD).style.getPropertyValue('--mg-fill')).toBe('#333333');
      expect(getRegion(graph.element, MuscleType.GASTROCNEMIUS_LATERAL_HEAD).style.getPropertyValue('--mg-fill')).toBe('#222222');
      expect(getRegion(graph.element, MuscleType.SOLEUS).style.getPropertyValue('--mg-fill')).toBe('#111111');
      for (const muscle of [MuscleType.CALVES, MuscleType.GASTROCNEMIUS, MuscleType.GASTROCNEMIUS_MEDIAL_HEAD, MuscleType.GASTROCNEMIUS_LATERAL_HEAD, MuscleType.SOLEUS]) {
        expect(graph.getStats(muscle)?.data.frequency).toBe(3);
      }
      graph.destroy();
    }
  });
});

function getRegion(root: HTMLElement, muscle: MuscleType): SVGGElement {
  const region = root.querySelector<SVGGElement>(`[data-muscle="${muscle}"]`);
  if (!region) throw new Error(`Missing ${muscle} region`);
  return region;
}
