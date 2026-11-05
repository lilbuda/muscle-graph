# muscle-graph

Contributions are welcome. Read [CONTRIBUTING.md](CONTRIBUTING.md), [CODE_OF_CONDUCT.md](CODE_OF_CONDUCT.md), and [SECURITY.md](SECURITY.md) before opening an issue or pull request.

An accessible, framework-agnostic SVG muscle map with male and female front/back artwork adapted from [react-muscle-highlighter](https://github.com/soroojshehryar/react-muscle-highlighter). `muscle-graph` has no runtime dependencies and works with Angular, React, Vue, Svelte, or plain JavaScript.

The licensed SVG path data and original view boxes are preserved. Female figures use a uniform display fit and a 20% head/hair reduction to align their apparent height and head proportions with the male figures. Existing separate paths are assigned to detailed muscle groups. Combined chest, biceps, male anterior deltoid, posterior deltoid and posterior trapezius contours are subdivided using complementary clipping masks to retain 32 detailed selectable muscle IDs. These added subdivisions are illustration regions for exercise selection.

## Features

- MIT-licensed male and female anterior/posterior SVG artwork
- 32 detailed muscle IDs and backward-compatible broad exercise inputs
- Independently selectable calf heads, hands and feet
- Frequency-based color palettes and per-muscle color overrides
- Human-readable anatomical aliases such as `Pectoralis Major` and `Gluteus Maximus`
- Mouse, touch, and keyboard interaction
- Accessible SVG labels and live frequency descriptions
- Responsive sizing and customizable styling
- Runtime `update`, `getStats`, and `destroy` helpers
- Typed ESM and UMD builds with zero runtime dependencies

## Install

```bash
npm install muscle-graph
```

## Quick start

```ts
import createMuscleGraph, { MuscleType, type ExerciseData } from 'muscle-graph';

const data: ExerciseData[] = [
  {
    name: 'Bench press',
    muscles: [MuscleType.CHEST, MuscleType.TRICEPS, MuscleType.FRONT_DELTOIDS],
    frequency: 3,
  },
  { name: 'Back extension', muscles: ['Erector Spinae'] },
];

const graph = createMuscleGraph({
  container: document.querySelector<HTMLElement>('#muscle-map') ?? undefined,
  data,
  bodyType: 'female',
  type: 'anterior',
  highlightedColors: ['#99f6e4', '#2dd4bf', '#0f766e'],
  onClick: ({ muscle, data: stats }) => {
    console.log(muscle, stats.frequency, stats.exercises);
  },
});

graph.update({ type: 'posterior', bodyType: 'male' });
graph.destroy();
```

If `container` is omitted, append `graph.element` wherever you want:

```ts
document.body.append(graph.element);
```

## Angular

The library renders directly into a host element, so it does not add Angular-specific code to your application bundle.

```ts
import {
  afterNextRender,
  Component,
  DestroyRef,
  effect,
  ElementRef,
  inject,
  Injector,
  input,
  viewChild,
} from '@angular/core';
import createMuscleGraph, { type ExerciseData, type MuscleGraphInstance } from 'muscle-graph';

@Component({
  selector: 'app-muscle-map',
  template: '<div #host></div>',
})
export class MuscleMapComponent {
  readonly data = input<readonly ExerciseData[]>([]);
  readonly bodyType = input<'male' | 'female'>('male');
  readonly type = input<'anterior' | 'posterior'>('anterior');

  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private graph?: MuscleGraphInstance;

  constructor() {
    afterNextRender(() => {
      this.graph = createMuscleGraph({ container: this.host().nativeElement });
      effect(() => {
        this.graph?.update({ data: this.data(), bodyType: this.bodyType(), type: this.type() });
      }, { injector: this.injector });
      this.destroyRef.onDestroy(() => this.graph?.destroy());
    });
  }
}
```

## Options

| Option | Type | Default | Purpose |
| --- | --- | --- | --- |
| `container` | `HTMLElement` | — | Element that receives the generated map |
| `data` | `readonly ExerciseData[]` | `[]` | Exercises used to calculate highlights |
| `bodyType` | `'male' \| 'female'` | `'male'` | Athletic male or female proportions |
| `type` | `'anterior' \| 'posterior'` | `'anterior'` | Front or back view |
| `bodyColor` | `string` | `#879297` | Unhighlighted muscle color |
| `bodyFillColor` | `string` | `transparent` | Body silhouette fill beneath the muscle regions |
| `highlightedColors` | `readonly string[]` | blue palette | Colors indexed by `Math.ceil(frequency) - 1`; the final color is reused |
| `muscleColors` | `Partial<Record<MuscleType, string | null>>` | `{}` | Per-muscle color overrides |
| `outlineColor` | `string` | `#ffffff` | Separation color between muscle regions |
| `bodyOutlineColor` | `string` | `#dfdfdf` | Outer body contour color. Use `none` to hide it |
| `hoverColor` | `string` | `#dc2626` | Hover and keyboard-focus fill and stroke |
| `backgroundColor` | `string` | `transparent` | Wrapper background |
| `wrapperClassName` | `string` | `mg-wrapper` | Additional wrapper class |
| `style` | `Record<string, string \| number>` | `{}` | Wrapper inline styles |
| `svgStyle` | `Record<string, string \| number>` | `{}` | SVG inline styles |
| `ariaLabel` | `string` | `Interactive muscle map` | Accessible SVG label |
| `onClick` | `(stats: MuscleStats) => void` | — | Click, touch, Enter, or Space callback |
| `onMouseEnter` | `(stats: MuscleStats) => void` | — | Muscle pointer-enter callback |
| `onMouseLeave` | `(stats: MuscleStats) => void` | — | Muscle pointer-leave callback |

An exercise's optional `frequency` defaults to `1`. Repeating a muscle within one exercise does not count it twice. Unknown muscle names are ignored.

## Color customization

All map colors accept CSS color strings and can be changed through `update()`. `bodyFillColor` fills the silhouette beneath the muscles. `bodyColor` sets the default muscle fill, and `muscleColors` overrides individual regions, including hair, hands and feet.

```ts
graph.update({
  bodyFillColor: '#e7eef4',
  bodyColor: '#879297',
  bodyOutlineColor: '#34495e',
  outlineColor: '#ffffff',
  backgroundColor: '#f8fafc',
  hoverColor: '#e76f51',
  highlightedColors: ['#b3e5fc', '#4fc3f7', '#0288d1'],
  muscleColors: {
    [MuscleType.UPPER_PECTORALIS]: '#f4a261',
    [MuscleType.GLUTEUS_MAXIMUS]: '#2a9d8f',
  },
});
```

## Instance API

```ts
interface MuscleGraphInstance {
  readonly element: HTMLElement;
  update(options: Partial<MuscleGraphOptions>): void;
  getStats(muscle: MuscleInput): MuscleStats | undefined;
  destroy(): void;
}
```

## Advanced muscle groups

Import `ADVANCED_MUSCLES` for the 32 selectable muscle identifiers. The [coverage table](docs/advanced-muscles.md) lists their front/back availability for both bodies. The two gastrocnemius heads are individually selectable rather than sharing a single ID.

```ts
import { ADVANCED_MUSCLES, MuscleType } from 'muscle-graph';

graph.update({
  data: [{ name: 'Incline press', muscles: [MuscleType.UPPER_PECTORALIS], frequency: 3 }],
  muscleColors: { [MuscleType.LATERAL_DELTOID]: '#e9a66f' },
});
```

Broad inputs such as `chest`, `biceps`, `triceps`, `quadriceps`, `hamstring`, `gluteal`, `forearm`, `abs`, `calves`, and `trapezius` expand to the corresponding detailed regions. Broad color overrides work the same way; an explicit detailed color takes precedence. A parent and its child listed in the same exercise count only once per muscle. `getStats()` can query either vocabulary. The legacy `left-soleus` and `right-soleus` inputs map to the bilateral soleus region.

Callbacks now report the detailed muscle identifier that was activated. The `data-muscle` DOM attribute also uses detailed IDs; use `data-muscle-groups~="chest"` to style all regions in a broad group. These callback/DOM changes replace the early prototype's broad-only rendering. Hands (`MuscleType.HANDS`), feet (`MuscleType.FEET`), head, neck, knees, ankles and hair are supplementary selectable areas outside the 32-region list. Availability follows the source artwork, including its hair and head shapes. They support the same colors, exercise data and activation callbacks.

Use `GASTROCNEMIUS_MEDIAL_HEAD` and `GASTROCNEMIUS_LATERAL_HEAD` to target the calf heads independently. `GASTROCNEMIUS` still targets both heads, and `CALVES` targets both heads plus `SOLEUS`. More specific color overrides take priority. Clicking a head reports its individual ID.

```ts
graph.update({ muscleColors: {
  [MuscleType.GASTROCNEMIUS_MEDIAL_HEAD]: '#df765d',
  [MuscleType.GASTROCNEMIUS_LATERAL_HEAD]: '#6f98b6',
  [MuscleType.SOLEUS]: '#86a785',
} });
```

## Custom CSS

The wrapper always receives `.mg-wrapper`; the SVG receives `.mg-svg`, and interactive regions receive `.mg-muscle` plus a `data-muscle` attribute.

```css
.workout-map .mg-muscle[data-muscle-groups~='chest'] .mg-muscle-part {
  stroke: #475569;
  stroke-width: 2.5px;
}
```

## Development

```bash
npm install
npm run dev
npm run check
```

The documentation website starts at the URL printed by Vite. It includes guides, local search, a light/dark theme and an interactive showcase. Run `npm run dev:playground` for the standalone playground. Tests verify the pinned upstream path hashes, subdivision coverage, independent highlights and interaction across all four views.

The library is released under the [MIT license](LICENSE). SVG artwork and body outlines are adapted from react-muscle-highlighter at commit `981291ca88a8d27205adc7532ebb2416b7e4609f`. The upstream MIT permission notice is included in [THIRD_PARTY_NOTICES.md](THIRD_PARTY_NOTICES.md) and distributed in the npm package.

## Runtime and update behavior

Importing the package is safe during server rendering. Create the graph after the host element mounts. A supplied container determines the DOM document, including iframe containers. Call `destroy()` when the host is removed.

Data, color, style and callback updates reuse the existing SVG. Changing `bodyType` or `type` rebuilds its geometry. Styles use pixel units for dimensions and unitless values for opacity, line height and CSS custom properties.

Color overrides merge across updates. Set an individual override to `null` to restore its palette or default color.

```ts
graph.update({ muscleColors: { [MuscleType.UPPER_PECTORALIS]: null } });
```

Development and package builds use Node.js 22.12 or newer. The published package includes ESM, CommonJS, UMD and corresponding TypeScript declarations. Run `npm run check` before publishing.

## Repository and documentation

- `src/` contains the published library source and licensed anatomy assets.
- `website/` contains the documentation app, guide content and static pre-rendering entry.
- `examples/playground/` contains a standalone library demo.
- `scripts/` contains build and package validation tooling.
- `test/` contains the API and anatomy regression tests.

Run `npm run docs:build` to generate the documentation in `website-dist/`. `npm run docs:preview` previews that output. Import this repository into Vercel with the repository root selected. The checked-in `vercel.json` configures the build and static output. The npm package uses the separate `dist/` output and an explicit file allowlist.

Guides live in `website/src/content/pages/`. Each page has a path, navigation group, description and anchored sections. Register new pages in `website/src/content/index.ts` to include them in navigation, search and the static HTML output.
