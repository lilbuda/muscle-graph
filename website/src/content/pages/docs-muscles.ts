import type { Page } from '../types.js';
import { section, note } from '../helpers.js';
import { table, escapeHtml } from '../../html.js';
import { frontMuscles, rearMuscles } from '../reference-data.js';
import { ADVANCED_MUSCLES, getMuscleLabel } from '../../../../src/muscles.js';

const page: Page = { path: '/docs/muscles', title: 'Muscle reference', group: 'Reference', description: 'Browse the 32 detailed muscle IDs, view availability, and broad input groups.', sections: [
    section('detailed', 'Detailed muscle regions', `<p>The same identifiers are available for male and female bodies. A region may be visible from one or both views.</p><label class="reference-filter">Filter muscles <input id="muscle-filter" type="search" placeholder="Name or identifier…" /></label>${table(['Muscle', 'Identifier', 'Front', 'Rear'], ADVANCED_MUSCLES.map(muscle => [escapeHtml(getMuscleLabel(muscle)), `<code>${muscle}</code>`, frontMuscles.has(muscle) ? 'Yes' : '—', rearMuscles.has(muscle) ? 'Yes' : '—']))}<p id="muscle-filter-status" role="status"></p>`),
    section('broad', 'Broad exercise inputs', `<p>Use these names when your workout data describes a broader group. They expand to the corresponding detailed regions.</p><p class="inline-codes">${['chest','biceps','triceps','forearm','trapezius','upper-back','lower-back','front-deltoids','back-deltoids','abs','obliques','adductor','abductors','quadriceps','hamstring','calves','gluteal'].map(value=>`<code>${value}</code>`).join(' ')}</p><p><code>gastrocnemius</code> targets both calf heads. <code>calves</code> includes both heads and soleus.</p>`),
    section('parts', 'Supplementary body parts', `<p><code>hands</code>, <code>feet</code>, <code>head</code>, <code>neck</code>, <code>knees</code>, <code>ankles</code>, and <code>hair</code> accept the same data, colors and callbacks. Their availability follows the artwork.</p>`),
    section('aliases', 'Aliases and legacy names', `<p>Names are case-insensitive. Spaces, hyphens and underscores are normalized. Aliases include <code>Pectoralis Major</code>, <code>pecs</code>, <code>quads</code>, and <code>Erector Spinae</code>.</p>${note('<code>MuscleType.ABDUCTOR</code> is a legacy alias for inner-thigh adduction. Use <code>MuscleType.ABDUCTORS</code> for outer-hip abduction. The legacy <code>LEFT_SOLEUS</code> and <code>RIGHT_SOLEUS</code> inputs both target the bilateral soleus group.')}`),
  ] };

export default page;
