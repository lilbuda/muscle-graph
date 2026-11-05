import type { Page } from '../types.js';
import { section } from '../helpers.js';
import { codeBlock } from '../../html.js';

const page: Page = { path: '/docs/theming', title: 'Colors & styling', group: 'Guides', description: 'Customize the silhouette, every muscle, borders, and interaction states.', sections: [
    section('colors', 'Set the global colors', `<p>All colors accept CSS color strings. Set the body silhouette independently from the default muscle fill.</p>${codeBlock(`graph.update({
  bodyColor: '#879487',
  bodyFillColor: '#e7e9df',
  bodyOutlineColor: '#5a675b',
  outlineColor: '#f7f7f2',
  hoverColor: '#b65e43',
  backgroundColor: 'transparent',
  highlightedColors: ['#d8b09d', '#c38a6e', '#ad6246'],
});`)}`),
    section('individual', 'Color individual muscles', `${codeBlock(`import { MuscleType } from 'muscle-graph';

graph.update({
  muscleColors: {
    [MuscleType.UPPER_PECTORALIS]: '#b65e43',
    [MuscleType.GLUTEUS_MAXIMUS]: '#508571',
  },
});`)}<p>Overrides work for detailed muscles, broad groups, and supplementary parts such as hair, hands, and feet.</p>`),
    section('precedence', 'Color precedence', `<ol><li>An explicit color for that muscle.</li><li>The nearest applicable parent group override.</li><li>The frequency palette when its frequency is positive.</li><li>The default <code>bodyColor</code>.</li></ol><p>Hover and keyboard focus use <code>hoverColor</code> for both fill and stroke.</p>`),
    section('reset', 'Remove an override', `<p>Color overrides merge across updates. An empty object preserves existing overrides. Set a key to <code>null</code> to restore its inherited color.</p>${codeBlock(`graph.update({ muscleColors: { [MuscleType.UPPER_PECTORALIS]: null } });`)}`),
    section('layout', 'Size and style the graph', `${codeBlock(`graph.update({
  style: { width: 320, maxWidth: '100%' },
  svgStyle: { opacity: 0.95 },
  wrapperClassName: 'workout-map',
});`)}<p>Numeric dimensions use pixels. Unitless properties and CSS custom properties retain raw numeric values. <code>style</code> and <code>svgStyle</code> each replace their previous map. Named color options take precedence over theme variables in <code>style</code>.</p>`),
  ] };

export default page;
