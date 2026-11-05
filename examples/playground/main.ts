import createMuscleGraph, { ADVANCED_MUSCLES, getMuscleLabel, resolveMuscle, MuscleType, type BodyType, type ExerciseData, type MuscleStats } from '../../src/index.js';

function element<T extends HTMLElement>(id: string): T {
  const found = document.getElementById(id);
  if (!(found instanceof HTMLElement)) throw new Error(`Missing #${id}`);
  return found as T;
}

const status = element('status');
const select = element<HTMLSelectElement>('muscle-select');
const segmentation = element<HTMLInputElement>('segmentation');
const bodyColor = element<HTMLInputElement>('body-color');
const bodyFillColor = element<HTMLInputElement>('body-fill-color');
const bodyOutlineColor = element<HTMLInputElement>('body-outline-color');
const outlineColor = element<HTMLInputElement>('outline-color');
const backgroundColor = element<HTMLInputElement>('background-color');
const highlightColor = element<HTMLInputElement>('highlight-color');
const selectable = [...ADVANCED_MUSCLES, MuscleType.HANDS, MuscleType.FEET, MuscleType.HEAD,
  MuscleType.NECK, MuscleType.KNEES, MuscleType.ANKLES, MuscleType.HAIR];
let bodyType: BodyType = 'male';
let selected: MuscleType | undefined;
const inspect = ({ muscle }: MuscleStats): void => { status.textContent = getMuscleLabel(muscle); };
const choose = ({ muscle }: MuscleStats): void => {
  selected = selected === muscle ? undefined : muscle;
  segmentation.checked = false;
  select.value = selected ?? '';
  render();
};
const shared = {
  bodyColor: bodyColor.value,
  bodyFillColor: bodyFillColor.value,
  bodyOutlineColor: bodyOutlineColor.value,
  outlineColor: outlineColor.value,
  backgroundColor: backgroundColor.value,
  hoverColor: highlightColor.value,
  highlightedColors: [highlightColor.value],
  onClick: choose,
  onMouseEnter: inspect,
  onMouseLeave: () => { status.textContent = selected ? getMuscleLabel(selected) : 'Choose a muscle to explore its anatomy.'; },
};
const graphs = [
  createMuscleGraph({ ...shared, container: element('front'), type: 'anterior', ariaLabel: 'Male anterior muscle map' }),
  createMuscleGraph({ ...shared, container: element('back'), type: 'posterior', ariaLabel: 'Male posterior muscle map' }),
] as const;

for (const muscle of [...selectable].sort((a, b) => getMuscleLabel(a).localeCompare(getMuscleLabel(b)))) {
  const option = document.createElement('option');
  option.value = muscle;
  option.textContent = getMuscleLabel(muscle);
  select.append(option);
}

function render(): void {
  const data: readonly ExerciseData[] = segmentation.checked
    ? selectable.map((muscle, index) => ({ name: 'Anatomy inspection', muscles: [muscle], frequency: index % 6 + 1 }))
    : selected ? [{ name: 'Selected muscle', muscles: [selected] }] : [];
  const palette = segmentation.checked
    ? ['#779b92', '#d2987b', '#879bb4', '#baa3bb', '#9baf78', '#c7b16d']
    : [highlightColor.value];
  for (const [index, graph] of graphs.entries()) {
    graph.update({ data, bodyType, bodyColor: bodyColor.value, hoverColor: highlightColor.value, highlightedColors: palette,
      bodyFillColor: bodyFillColor.value, bodyOutlineColor: bodyOutlineColor.value,
      outlineColor: outlineColor.value, backgroundColor: backgroundColor.value,
      ariaLabel: `${bodyType} ${index === 0 ? 'anterior' : 'posterior'} advanced muscle map` });
  }
  for (const gender of ['male', 'female'] as const) element(gender).setAttribute('aria-pressed', String(bodyType === gender));
  element('model-label').textContent = `${bodyType === 'male' ? 'Male' : 'Female'} anatomy`;
  status.textContent = selected ? getMuscleLabel(selected) : segmentation.checked ? '32 detailed muscle regions, plus supplementary body parts.' : 'Choose a muscle to explore its anatomy.';
}

for (const gender of ['male', 'female'] as const) element(gender).addEventListener('click', () => { bodyType = gender; render(); });
select.addEventListener('change', () => { selected = resolveMuscle(select.value); segmentation.checked = false; render(); });
for (const control of [bodyColor, bodyFillColor, bodyOutlineColor, outlineColor, backgroundColor, highlightColor]) control.addEventListener('input', render);
segmentation.addEventListener('input', () => { selected = undefined; select.value = ''; render(); });
element('reset').addEventListener('click', () => {
  selected = undefined;
  select.value = '';
  segmentation.checked = false;
  bodyColor.value = '#879297';
  bodyFillColor.value = '#ffffff';
  bodyOutlineColor.value = '#dfdfdf';
  outlineColor.value = '#ffffff';
  backgroundColor.value = '#ffffff';
  highlightColor.value = '#d65d4a';
  render();
});
