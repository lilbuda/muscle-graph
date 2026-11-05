import type { Page } from '../types.js';
import { section } from '../helpers.js';
import { codeBlock } from '../../html.js';

const page: Page = { path: '/docs/data', title: 'Workout data', group: 'Guides', description: 'Turn exercises, muscle names, and training frequencies into highlights.', sections: [
    section('exercise-data', 'Describe an exercise', `${codeBlock(`import type { ExerciseData } from 'muscle-graph';

const data: readonly ExerciseData[] = [
  { name: 'Bench press', muscles: ['chest', 'triceps'], frequency: 3 },
  { name: 'Calf raise', muscles: ['calves'], frequency: 2 },
];

graph.update({ data });`)}<p><code>name</code> identifies the exercise in callback statistics. <code>muscles</code> accepts enum values or recognized strings. <code>frequency</code> defaults to 1.</p>`),
    section('aggregation', 'How frequencies accumulate', `<p>Each exercise contributes its frequency once to each matching muscle. Listing a parent and its child in the same exercise does not count that muscle twice. Separate exercise entries accumulate independently.</p><p>Broad groups expand to their descendants. A detailed input also contributes to its ancestors. Parent statistics count matching exercises rather than summing all child frequencies.</p>${codeBlock(`const data = [
  { name: 'Press', muscles: ['chest', 'upper-pectoralis'], frequency: 3 },
  { name: 'Incline press', muscles: ['upper-pectoralis'] },
];
// Chest = 4, upper pectoralis = 4, mid/lower pectoralis = 3`)}`),
    section('palette', 'Frequency palettes', `<p>A positive frequency selects <code>Math.ceil(frequency) - 1</code> in <code>highlightedColors</code>. Frequencies beyond the palette reuse its last color. Zero uses the default muscle color. Fractional values remain fractional in statistics.</p>${codeBlock(`graph.update({ highlightedColors: ['#c4d8ce', '#79a78e', '#357459'] });`)}<p>Negative finite frequencies become zero. Non-finite values use 1. Unknown muscle names are ignored. An empty palette retains the previous palette.</p>`),
    section('stats', 'Read statistics', `${codeBlock(`const stats = graph.getStats('chest');
// { muscle: 'chest', data: { exercises: [...], frequency: 4 } }`) }<p>Known muscles return statistics even when hidden in the current view or absent from your workout. Unused muscles return an empty exercise list and zero frequency. Unknown names return <code>undefined</code>.</p>`),
  ] };

export default page;
