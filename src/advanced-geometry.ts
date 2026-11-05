import { bodyFront } from './anatomy/bodyFront.js';
import { bodyBack } from './anatomy/bodyBack.js';
import { bodyFemaleFront } from './anatomy/bodyFemaleFront.js';
import { bodyFemaleBack } from './anatomy/bodyFemaleBack.js';
import { femaleBackOutline, femaleFrontOutline, maleBackOutline, maleFrontOutline } from './anatomy/outlines.js';
import type { BodyPart } from './anatomy/types.js';
import { MuscleType as M } from './muscles.js';
import type { BodyType, ModelType } from './types.js';

export interface MuscleRegion {
  readonly muscle: M;
  readonly paths: readonly string[];
  readonly clips: readonly (string | undefined)[];
}

export interface AnatomyModel {
  readonly viewBox: string;
  readonly silhouette: string;
  readonly regions: readonly MuscleRegion[];
}

type Bounds = readonly [x: number, y: number, width: number, height: number];
type Side = 'left' | 'right';

// These masks partition the licensed contours. The source paths are never
// resampled or redrawn, so their union preserves the upstream silhouette.
function horizontalBands([x, y, width, height]: Bounds, cuts: readonly number[]): readonly string[] {
  const left = x - 4;
  const right = x + width + 4;
  const levels = [-0.05, ...cuts, 1.05];
  return levels.slice(1).map((bottom, index) => {
    const top = levels[index] ?? -0.05;
    const curve = (level: number, reverse: boolean): string => {
      const edge = y + height * level;
      const bend = height * 0.06;
      return reverse
        ? `C ${x + width * 0.7} ${edge + bend} ${x + width * 0.3} ${edge - bend} ${left} ${edge}`
        : `C ${x + width * 0.3} ${edge - bend} ${x + width * 0.7} ${edge + bend} ${right} ${edge}`;
    };
    return `M ${left} ${y + height * top} ${curve(top, false)} L ${right} ${y + height * bottom} ${curve(bottom, true)} Z`;
  });
}

function longitudinalHalves(
  [x, y, width, height]: Bounds,
  side: Side,
  fractions: readonly [number, number] = [0.65, 0.35],
): readonly [string, string] {
  const top = y - 4;
  const bottom = y + height + 4;
  const outer = side === 'left' ? x - 4 : x + width + 4;
  const inner = side === 'left' ? x + width + 4 : x - 4;
  const start = x + width * (side === 'left' ? fractions[0] : 1 - fractions[0]);
  const end = x + width * (side === 'left' ? fractions[1] : 1 - fractions[1]);
  const controlY1 = y + height * 0.36;
  const controlY2 = y + height * 0.7;
  return [
    `M ${outer} ${top} L ${start} ${top} C ${start} ${controlY1} ${end} ${controlY2} ${end} ${bottom} L ${outer} ${bottom} Z`,
    `M ${start} ${top} L ${inner} ${top} L ${inner} ${bottom} L ${end} ${bottom} C ${end} ${controlY2} ${start} ${controlY1} ${start} ${top} Z`,
  ];
}

const landmarks = {
  male: {
    chest: { left: [255, 317, 103, 118], right: [369, 317, 104, 118] },
    biceps: { left: [182, 406, 41, 87], right: [505, 406, 41, 87] },
    deltoids: { left: [195, 303, 84, 93], right: [450, 303, 84, 93] },
    rearDeltoids: { left: [914, 311, 67, 87], right: [1186, 311, 67, 87] },
    trapezius: { left: [1003, 297, 77, 176], right: [1087, 297, 77, 176] },
  },
  female: {
    chest: { left: [215, 319, 102, 114], right: [324, 319, 102, 114] },
    biceps: { left: [155, 383, 53, 94], right: [433, 383, 53, 94] },
    deltoids: { left: [167, 285, 71, 85], right: [403, 285, 71, 85] },
    rearDeltoids: { left: [991, 288, 67, 84], right: [1231, 288, 62, 84] },
    trapezius: { left: [1035, 280, 103, 127], right: [1147, 280, 103, 127] },
  },
} as const;

const directGroups: Readonly<Record<string, M>> = {
  obliques: M.OBLIQUES, neck: M.NECK, head: M.HEAD, hair: M.HAIR,
  knees: M.KNEES, hands: M.HANDS, feet: M.FEET, ankles: M.ANKLES,
  tibialis: M.TIBIALIS, adductors: M.INNER_THIGH, 'lower-back': M.LOWER_BACK,
  'upper-back': M.LATS,
};

const sources = {
  male: {
    anterior: { parts: bodyFront, viewBox: '0 0 724 1448', silhouette: maleFrontOutline },
    posterior: { parts: bodyBack, viewBox: '724 0 724 1448', silhouette: maleBackOutline },
  },
  female: {
    anterior: { parts: bodyFemaleFront, viewBox: '-50 -40 734 1538', silhouette: femaleFrontOutline },
    posterior: { parts: bodyFemaleBack, viewBox: '756 0 774 1448', silhouette: femaleBackOutline },
  },
};

const tricepsHeads = {
  male: [M.LATERAL_HEAD_TRICEPS, M.LONG_HEAD_TRICEPS, M.MEDIAL_HEAD_TRICEPS],
  female: [M.LATERAL_HEAD_TRICEPS, M.MEDIAL_HEAD_TRICEPS, M.LONG_HEAD_TRICEPS],
} as const;

const lowerAbdominalPath = {
  male: 3,
  female: 1,
} as const;

// Female source arrays use a different ordering on each side. Translate
// right-side indices to their corresponding left-side anatomical paths before
// assigning detailed IDs. Coordinates and source array order stay intact.
const femaleRightPathIndices: Readonly<Record<ModelType, Readonly<Record<string, readonly number[]>>>> = {
  anterior: {
    abs: [3, 2, 1, 0],
    forearm: [3, 1, 0, 2],
  },
  posterior: {
    triceps: [2, 0, 1],
    forearm: [2, 1, 0, 3],
    gluteal: [1, 0],
    hamstring: [1, 2, 0],
    calves: [2, 3, 1, 0],
  },
};

const maleRightPathIndices: Readonly<Record<ModelType, Readonly<Record<string, readonly number[]>>>> = {
  anterior: {
    abs: [2, 0, 1, 3],
  },
  posterior: {
    'upper-back': [0, 2, 1],
    forearm: [1, 0, 2, 3],
    hamstring: [2, 1, 3, 0],
    calves: [0, 2, 1, 3],
  },
};

function buildAnatomy(bodyType: BodyType, type: ModelType): AnatomyModel {
  const front = type === 'anterior';
  const female = bodyType === 'female';
  const source = sources[bodyType][type];
  const rightPathIndices = female ? femaleRightPathIndices : maleRightPathIndices;
  const parts: readonly BodyPart[] = source.parts;
  const regions = new Map<M, { muscle: M; paths: string[]; clips: (string | undefined)[] }>();
  const add = (muscle: M, path: string, clip?: string): void => {
    const region = regions.get(muscle) ?? { muscle, paths: [], clips: [] };
    region.paths.push(path);
    region.clips.push(clip);
    regions.set(muscle, region);
  };
  for (const part of parts) {
    for (const path of part.path.common ?? []) add(directGroups[part.slug] ?? M.HEAD, path);
    for (const side of ['left', 'right'] as const) {
      for (const [sourceIndex, path] of (part.path[side] ?? []).entries()) {
        const index = side === 'right'
          ? rightPathIndices[type][part.slug]?.[sourceIndex] ?? sourceIndex
          : sourceIndex;
        const direct = directGroups[part.slug];
        if (direct) {
          add(direct, path);
          continue;
        }
        switch (part.slug) {
          case 'chest': {
            const bands = horizontalBands(landmarks[bodyType].chest[side], [0.32]);
            add(M.UPPER_PECTORALIS, path, bands[0]);
            add(M.MID_LOWER_PECTORALIS, path, bands[1]);
            break;
          }
          case 'biceps': {
            const [long, short] = longitudinalHalves(landmarks[bodyType].biceps[side], side);
            add(M.LONG_HEAD_BICEPS, path, long);
            add(M.SHORT_HEAD_BICEPS, path, short);
            break;
          }
          case 'trapezius': {
            if (front) add(M.UPPER_TRAPEZIUS, path);
            else {
              const bands = horizontalBands(landmarks[bodyType].trapezius[side], [0.23, 0.52]);
              add(M.UPPER_TRAPEZIUS, path, bands[0]);
              add(M.MIDDLE_TRAPEZIUS, path, bands[1]);
              add(M.LOWER_TRAPEZIUS, path, bands[2]);
            }
            break;
          }
          case 'deltoids': {
            if (!front) {
              const [lateral, posterior] = longitudinalHalves(landmarks[bodyType].rearDeltoids[side], side, [0.25, 0.25]);
              add(M.LATERAL_DELTOID, path, lateral);
              add(M.POSTERIOR_DELTOID, path, posterior);
            }
            else if (female) add(index === 0 ? M.LATERAL_DELTOID : M.ANTERIOR_DELTOID, path);
            else {
              const [lateral, anterior] = longitudinalHalves(landmarks.male.deltoids[side], side);
              add(M.LATERAL_DELTOID, path, lateral);
              add(M.ANTERIOR_DELTOID, path, anterior);
            }
            break;
          }
          case 'abs':
            add(index === lowerAbdominalPath[bodyType] ? M.LOWER_ABDOMINALS : M.UPPER_ABDOMINALS, path);
            break;
          case 'triceps': {
            const muscle = front ? M.LONG_HEAD_TRICEPS : tricepsHeads[bodyType][index] ?? M.LONG_HEAD_TRICEPS;
            add(muscle, path);
            break;
          }
          case 'forearm': {
            const extensor = front ? female ? index >= 2 : index === 0 : index !== 3;
            add(extensor ? M.WRIST_EXTENSORS : M.WRIST_FLEXORS, path);
            break;
          }
          case 'quadriceps':
            add([M.RECTUS_FEMORIS, M.OUTER_QUADRICEP, M.INNER_QUADRICEP][index] ?? M.RECTUS_FEMORIS, path);
            break;
          case 'gluteal':
            add(index === 0 ? M.GLUTEUS_MEDIUS : M.GLUTEUS_MAXIMUS, path);
            break;
          case 'hamstring':
            add((female ? index < 2 : index % 2 === 0) ? M.LATERAL_HAMSTRINGS : M.MEDIAL_HAMSTRINGS, path);
            break;
          case 'calves': {
            if (front) add(index === (female ? 0 : 1) ? M.GASTROCNEMIUS_MEDIAL_HEAD : M.SOLEUS, path);
            else {
              const calf = [M.GASTROCNEMIUS_LATERAL_HEAD, M.SOLEUS, M.GASTROCNEMIUS_MEDIAL_HEAD, M.SOLEUS];
              add(calf[index] ?? M.SOLEUS, path);
            }
            break;
          }
        }
      }
    }
  }
  return {
    viewBox: source.viewBox,
    silhouette: source.silhouette,
    regions: [...regions.values()],
  };
}

const models = {
  male: { anterior: buildAnatomy('male', 'anterior'), posterior: buildAnatomy('male', 'posterior') },
  female: { anterior: buildAnatomy('female', 'anterior'), posterior: buildAnatomy('female', 'posterior') },
};

export function getAnatomy(bodyType: BodyType, type: ModelType): AnatomyModel {
  return models[bodyType][type];
}
