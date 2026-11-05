import type { Page } from '../types.js';
import { section } from '../helpers.js';
import { codeBlock, table, escapeHtml } from '../../html.js';
import { options } from '../reference-data.js';

const page: Page = { path: '/docs/api', title: 'API reference', group: 'Reference', description: 'Every option, return value, callback, and exported helper in one place.', sections: [
    section('create-muscle-graph', 'createMuscleGraph()', `${codeBlock(`declare function createMuscleGraph(
  options?: MuscleGraphOptions,
): MuscleGraphInstance;`)}<p>Create an instance with optional configuration. Both default and named imports are supported.</p>`),
    section('options', 'Options', table(['Option', 'Type', 'Default', 'Description'], options.map(([name, type, value, description]) => [`<code>${escapeHtml(name ?? '')}</code>`, `<code>${escapeHtml(type ?? '')}</code>`, `<code>${escapeHtml(value ?? '')}</code>`, escapeHtml(description ?? '')]))),
    section('instance', 'Instance methods', `${codeBlock(`interface MuscleGraphInstance {
  readonly element: HTMLElement;
  update(options: Partial<MuscleGraphOptions>): void;
  getStats(muscle: MuscleInput): MuscleStats | undefined;
  destroy(): void;
}`)}<p><code>update</code> merges options, with replacing data and style maps and merging muscle overrides. <code>element</code> is the stable wrapper. <code>getStats</code> accepts an enum identifier or recognized string.</p>`),
    section('data-types', 'Data types', `${codeBlock(`interface ExerciseData {
  readonly name: string;
  readonly muscles: readonly MuscleInput[];
  readonly frequency?: number;
}

interface MuscleStats {
  readonly muscle: MuscleType;
  readonly data: {
    readonly exercises: readonly string[];
    readonly frequency: number;
  };
}

type BodyType = 'male' | 'female';
type ModelType = 'anterior' | 'posterior';
type MuscleInput = MuscleType | string;
type StyleMap = Readonly<Record<string, string | number>>;`)}`),
    section('helpers', 'Exported helpers', table(['Export', 'Purpose'], [
      ['<code>MuscleType</code>', 'Enum of detailed groups, broad groups and supplementary parts.'],
      ['<code>ADVANCED_MUSCLES</code>', 'Readonly list of 32 detailed muscle identifiers.'],
      ['<code>MUSCLES</code>', 'Readonly list of all recognized enum identifiers.'],
      ['<code>resolveMuscle(name)</code>', 'Resolve a supported name or alias. Returns undefined for unknown names.'],
      ['<code>getMuscleLabel(muscle)</code>', 'Get a human-readable label for an enum identifier.'],
      ['<code>calculateMuscleStats(data)</code>', 'Calculate a ReadonlyMap of frequencies and exercise lists without creating a graph.'],
    ])),
  ] };

export default page;
