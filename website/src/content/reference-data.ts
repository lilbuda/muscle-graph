import { MuscleType } from '../../../src/muscles.js';

export const options = [
  ['container', 'HTMLElement', '—', 'Host element used when the graph is created. Omit it to mount element yourself.'],
  ['data', 'readonly ExerciseData[]', '[]', 'Exercises that drive frequencies and highlighting.'],
  ['bodyType', "'male' | 'female'", "'male'", 'Choose a body model.'],
  ['type', "'anterior' | 'posterior'", "'anterior'", 'Choose the front or rear view.'],
  ['bodyColor', 'string', '#879297', 'Default fill for unhighlighted muscle regions.'],
  ['bodyFillColor', 'string', 'transparent', 'Fill of the body silhouette beneath the muscles.'],
  ['bodyOutlineColor', 'string', '#dfdfdf', 'Outer body contour. Use none to hide it.'],
  ['outlineColor', 'string', '#ffffff', 'Borders between muscle regions.'],
  ['highlightedColors', 'readonly string[]', 'blue palette', 'Frequency palette. The final color covers higher frequencies.'],
  ['muscleColors', 'Partial<Readonly<Record<MuscleType, string | null>>>', '{}', 'Individual or broad group overrides. A null value removes an override.'],
  ['hoverColor', 'string', '#dc2626', 'Fill and stroke on hover and keyboard focus.'],
  ['backgroundColor', 'string', 'transparent', 'Background of the wrapper.'],
  ['wrapperClassName', 'string', 'mg-wrapper', 'Your wrapper class. mg-wrapper is always included.'],
  ['style', 'StyleMap', '{}', 'Wrapper styles. Replaces the previous style map on update.'],
  ['svgStyle', 'StyleMap', '{}', 'SVG styles. Replaces the previous SVG style map on update.'],
  ['ariaLabel', 'string', 'Interactive muscle map', 'Accessible name for this SVG model.'],
  ['onClick', '(stats: MuscleStats) => void', '—', 'Activation callback for click, touch, Enter and Space.'],
  ['onMouseEnter', '(stats: MuscleStats) => void', '—', 'Runs when the pointer enters a muscle group.'],
  ['onMouseLeave', '(stats: MuscleStats) => void', '—', 'Runs when the pointer leaves a muscle group.'],
];

export const frontMuscles = new Set<MuscleType>([
  MuscleType.UPPER_TRAPEZIUS, MuscleType.UPPER_PECTORALIS, MuscleType.MID_LOWER_PECTORALIS,
  MuscleType.ANTERIOR_DELTOID, MuscleType.LATERAL_DELTOID, MuscleType.LONG_HEAD_BICEPS,
  MuscleType.SHORT_HEAD_BICEPS, MuscleType.LONG_HEAD_TRICEPS, MuscleType.WRIST_FLEXORS,
  MuscleType.WRIST_EXTENSORS, MuscleType.UPPER_ABDOMINALS, MuscleType.LOWER_ABDOMINALS,
  MuscleType.OBLIQUES, MuscleType.OUTER_QUADRICEP, MuscleType.RECTUS_FEMORIS,
  MuscleType.INNER_QUADRICEP, MuscleType.INNER_THIGH, MuscleType.GASTROCNEMIUS_MEDIAL_HEAD,
  MuscleType.TIBIALIS, MuscleType.SOLEUS,
]);

export const rearMuscles = new Set<MuscleType>([
  MuscleType.UPPER_TRAPEZIUS, MuscleType.MIDDLE_TRAPEZIUS, MuscleType.LOWER_TRAPEZIUS,
  MuscleType.LATS, MuscleType.LOWER_BACK, MuscleType.LATERAL_DELTOID, MuscleType.POSTERIOR_DELTOID,
  MuscleType.LONG_HEAD_TRICEPS, MuscleType.LATERAL_HEAD_TRICEPS, MuscleType.MEDIAL_HEAD_TRICEPS,
  MuscleType.WRIST_FLEXORS, MuscleType.WRIST_EXTENSORS, MuscleType.INNER_THIGH,
  MuscleType.MEDIAL_HAMSTRINGS, MuscleType.LATERAL_HAMSTRINGS, MuscleType.GLUTEUS_MAXIMUS,
  MuscleType.GLUTEUS_MEDIUS, MuscleType.GASTROCNEMIUS_MEDIAL_HEAD, MuscleType.GASTROCNEMIUS_LATERAL_HEAD, MuscleType.SOLEUS,
]);
