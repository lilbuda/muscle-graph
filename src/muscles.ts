export enum MuscleType {
  TRAPEZIUS = 'trapezius',
  UPPER_BACK = 'upper-back',
  LOWER_BACK = 'lower-back',
  CHEST = 'chest',
  BICEPS = 'biceps',
  TRICEPS = 'triceps',
  FOREARM = 'forearm',
  BACK_DELTOIDS = 'back-deltoids',
  FRONT_DELTOIDS = 'front-deltoids',
  ABS = 'abs',
  OBLIQUES = 'obliques',
  ADDUCTOR = 'adductor',
  // Upstream uses ABDUCTOR as the key for the adductor region.
  ABDUCTOR = 'adductor',
  HAMSTRING = 'hamstring',
  QUADRICEPS = 'quadriceps',
  ABDUCTORS = 'abductors',
  CALVES = 'calves',
  GLUTEAL = 'gluteal',
  HEAD = 'head',
  NECK = 'neck',
  KNEES = 'knees',
  LEFT_SOLEUS = 'left-soleus',
  RIGHT_SOLEUS = 'right-soleus',
  UPPER_TRAPEZIUS = 'upper-trapezius',
  MIDDLE_TRAPEZIUS = 'middle-trapezius',
  LOWER_TRAPEZIUS = 'lower-trapezius',
  LATS = 'lats',
  UPPER_PECTORALIS = 'upper-pectoralis',
  MID_LOWER_PECTORALIS = 'mid-lower-pectoralis',
  ANTERIOR_DELTOID = 'anterior-deltoid',
  LATERAL_DELTOID = 'lateral-deltoid',
  POSTERIOR_DELTOID = 'posterior-deltoid',
  LONG_HEAD_BICEPS = 'long-head-bicep',
  SHORT_HEAD_BICEPS = 'short-head-bicep',
  LONG_HEAD_TRICEPS = 'long-head-triceps',
  LATERAL_HEAD_TRICEPS = 'lateral-head-triceps',
  MEDIAL_HEAD_TRICEPS = 'medial-head-triceps',
  WRIST_FLEXORS = 'wrist-flexors',
  WRIST_EXTENSORS = 'wrist-extensors',
  UPPER_ABDOMINALS = 'upper-abdominals',
  LOWER_ABDOMINALS = 'lower-abdominals',
  OUTER_QUADRICEP = 'outer-quadricep',
  RECTUS_FEMORIS = 'rectus-femoris',
  INNER_QUADRICEP = 'inner-quadricep',
  INNER_THIGH = 'inner-thigh',
  MEDIAL_HAMSTRINGS = 'medial-hamstrings',
  LATERAL_HAMSTRINGS = 'lateral-hamstrings',
  GLUTEUS_MAXIMUS = 'gluteus-maximus',
  GLUTEUS_MEDIUS = 'gluteus-medius',
  GASTROCNEMIUS = 'gastrocnemius',
  GASTROCNEMIUS_MEDIAL_HEAD = 'gastrocnemius-medial-head',
  GASTROCNEMIUS_LATERAL_HEAD = 'gastrocnemius-lateral-head',
  TIBIALIS = 'tibialis',
  SOLEUS = 'soleus',
  HANDS = 'hands',
  FEET = 'feet',
  ANKLES = 'ankles',
  HAIR = 'hair',
}

export const MUSCLES = Object.freeze([...new Set(Object.values(MuscleType))]);

export const ADVANCED_MUSCLES: readonly MuscleType[] = Object.freeze([
  MuscleType.UPPER_TRAPEZIUS, MuscleType.MIDDLE_TRAPEZIUS, MuscleType.LOWER_TRAPEZIUS,
  MuscleType.LATS, MuscleType.LOWER_BACK, MuscleType.UPPER_PECTORALIS, MuscleType.MID_LOWER_PECTORALIS,
  MuscleType.ANTERIOR_DELTOID, MuscleType.LATERAL_DELTOID, MuscleType.POSTERIOR_DELTOID,
  MuscleType.LONG_HEAD_BICEPS, MuscleType.SHORT_HEAD_BICEPS,
  MuscleType.LONG_HEAD_TRICEPS, MuscleType.LATERAL_HEAD_TRICEPS, MuscleType.MEDIAL_HEAD_TRICEPS,
  MuscleType.WRIST_FLEXORS, MuscleType.WRIST_EXTENSORS,
  MuscleType.UPPER_ABDOMINALS, MuscleType.LOWER_ABDOMINALS, MuscleType.OBLIQUES,
  MuscleType.OUTER_QUADRICEP, MuscleType.RECTUS_FEMORIS, MuscleType.INNER_QUADRICEP, MuscleType.INNER_THIGH,
  MuscleType.MEDIAL_HAMSTRINGS, MuscleType.LATERAL_HAMSTRINGS,
  MuscleType.GLUTEUS_MAXIMUS, MuscleType.GLUTEUS_MEDIUS,
  MuscleType.GASTROCNEMIUS_MEDIAL_HEAD, MuscleType.GASTROCNEMIUS_LATERAL_HEAD, MuscleType.TIBIALIS, MuscleType.SOLEUS,
]);

export const MUSCLE_CHILDREN: Partial<Readonly<Record<MuscleType, readonly MuscleType[]>>> = Object.freeze({
  [MuscleType.TRAPEZIUS]: [MuscleType.UPPER_TRAPEZIUS, MuscleType.MIDDLE_TRAPEZIUS, MuscleType.LOWER_TRAPEZIUS],
  [MuscleType.UPPER_BACK]: [MuscleType.LATS, MuscleType.MIDDLE_TRAPEZIUS, MuscleType.LOWER_TRAPEZIUS],
  [MuscleType.CHEST]: [MuscleType.UPPER_PECTORALIS, MuscleType.MID_LOWER_PECTORALIS],
  [MuscleType.BICEPS]: [MuscleType.LONG_HEAD_BICEPS, MuscleType.SHORT_HEAD_BICEPS],
  [MuscleType.TRICEPS]: [MuscleType.LONG_HEAD_TRICEPS, MuscleType.LATERAL_HEAD_TRICEPS, MuscleType.MEDIAL_HEAD_TRICEPS],
  [MuscleType.FOREARM]: [MuscleType.WRIST_FLEXORS, MuscleType.WRIST_EXTENSORS],
  [MuscleType.FRONT_DELTOIDS]: [MuscleType.ANTERIOR_DELTOID, MuscleType.LATERAL_DELTOID],
  [MuscleType.BACK_DELTOIDS]: [MuscleType.POSTERIOR_DELTOID],
  [MuscleType.ABS]: [MuscleType.UPPER_ABDOMINALS, MuscleType.LOWER_ABDOMINALS],
  [MuscleType.ADDUCTOR]: [MuscleType.INNER_THIGH],
  [MuscleType.ABDUCTORS]: [MuscleType.GLUTEUS_MEDIUS],
  [MuscleType.QUADRICEPS]: [MuscleType.OUTER_QUADRICEP, MuscleType.RECTUS_FEMORIS, MuscleType.INNER_QUADRICEP],
  [MuscleType.HAMSTRING]: [MuscleType.MEDIAL_HAMSTRINGS, MuscleType.LATERAL_HAMSTRINGS],
  [MuscleType.GLUTEAL]: [MuscleType.GLUTEUS_MAXIMUS, MuscleType.GLUTEUS_MEDIUS],
  [MuscleType.CALVES]: [MuscleType.GASTROCNEMIUS, MuscleType.SOLEUS],
  [MuscleType.GASTROCNEMIUS]: [MuscleType.GASTROCNEMIUS_MEDIAL_HEAD, MuscleType.GASTROCNEMIUS_LATERAL_HEAD],
  [MuscleType.LEFT_SOLEUS]: [MuscleType.SOLEUS],
  [MuscleType.RIGHT_SOLEUS]: [MuscleType.SOLEUS],
});

const parentCache = new Map<MuscleType, readonly MuscleType[]>();
const descendantCache = new Map<MuscleType, readonly MuscleType[]>();
Object.values(MUSCLE_CHILDREN).forEach(Object.freeze);

export function getMuscleParents(muscle: MuscleType): readonly MuscleType[] {
  const cached = parentCache.get(muscle);
  if (cached) return cached;
  const visited = new Set<MuscleType>([muscle]);
  const queue = [muscle];
  const parents: MuscleType[] = [];
  for (const current of queue) {
    for (const candidate of MUSCLES) {
      if (!visited.has(candidate) && MUSCLE_CHILDREN[candidate]?.includes(current)) {
        visited.add(candidate);
        parents.push(candidate);
        queue.push(candidate);
      }
    }
  }
  parentCache.set(muscle, Object.freeze(parents));
  return parents;
}

export function getMuscleDescendants(muscle: MuscleType): readonly MuscleType[] {
  const cached = descendantCache.get(muscle);
  if (cached) return cached;
  const visited = new Set<MuscleType>([muscle]);
  const queue = [muscle];
  const descendants: MuscleType[] = [];
  for (const current of queue) for (const child of MUSCLE_CHILDREN[current] ?? []) {
    if (!visited.has(child)) {
      visited.add(child);
      descendants.push(child);
      queue.push(child);
    }
  }
  descendantCache.set(muscle, Object.freeze(descendants));
  return descendants;
}

const aliases: Readonly<Record<string, MuscleType>> = {
  traps: MuscleType.TRAPEZIUS,
  trapezius: MuscleType.TRAPEZIUS,
  'upper back': MuscleType.UPPER_BACK,
  rhomboids: MuscleType.UPPER_BACK,
  latissimus: MuscleType.UPPER_BACK,
  lats: MuscleType.LATS,
  'lower back': MuscleType.LOWER_BACK,
  'erector spinae': MuscleType.LOWER_BACK,
  chest: MuscleType.CHEST,
  pecs: MuscleType.CHEST,
  pectorals: MuscleType.CHEST,
  'pectoralis major': MuscleType.CHEST,
  bicep: MuscleType.BICEPS,
  biceps: MuscleType.BICEPS,
  tricep: MuscleType.TRICEPS,
  triceps: MuscleType.TRICEPS,
  forearm: MuscleType.FOREARM,
  forearms: MuscleType.FOREARM,
  'rear delts': MuscleType.BACK_DELTOIDS,
  'rear deltoids': MuscleType.BACK_DELTOIDS,
  'back deltoids': MuscleType.BACK_DELTOIDS,
  'front delts': MuscleType.FRONT_DELTOIDS,
  'front deltoids': MuscleType.FRONT_DELTOIDS,
  'anterior deltoids': MuscleType.FRONT_DELTOIDS,
  abs: MuscleType.ABS,
  abdominals: MuscleType.ABS,
  'rectus abdominis': MuscleType.ABS,
  oblique: MuscleType.OBLIQUES,
  obliques: MuscleType.OBLIQUES,
  adductor: MuscleType.ADDUCTOR,
  adductors: MuscleType.ADDUCTOR,
  hamstring: MuscleType.HAMSTRING,
  hamstrings: MuscleType.HAMSTRING,
  quadricep: MuscleType.QUADRICEPS,
  quadriceps: MuscleType.QUADRICEPS,
  quads: MuscleType.QUADRICEPS,
  abductor: MuscleType.ABDUCTORS,
  abductors: MuscleType.ABDUCTORS,
  calf: MuscleType.CALVES,
  calves: MuscleType.CALVES,
  gastrocnemius: MuscleType.GASTROCNEMIUS,
  gluteal: MuscleType.GLUTEAL,
  gluteals: MuscleType.GLUTEAL,
  glutes: MuscleType.GLUTEAL,
  'gluteus maximus': MuscleType.GLUTEUS_MAXIMUS,
  head: MuscleType.HEAD,
  neck: MuscleType.NECK,
  knee: MuscleType.KNEES,
  knees: MuscleType.KNEES,
  'left soleus': MuscleType.LEFT_SOLEUS,
  'right soleus': MuscleType.RIGHT_SOLEUS,
  'upper chest': MuscleType.UPPER_PECTORALIS,
  'lower chest': MuscleType.MID_LOWER_PECTORALIS,
  'middle chest': MuscleType.MID_LOWER_PECTORALIS,
  'upper traps': MuscleType.UPPER_TRAPEZIUS,
  'middle traps': MuscleType.MIDDLE_TRAPEZIUS,
  'lower traps': MuscleType.LOWER_TRAPEZIUS,
  'traps middle': MuscleType.MIDDLE_TRAPEZIUS,
  'latissimus dorsi': MuscleType.LATS,
  lowerback: MuscleType.LOWER_BACK,
  'long head biceps': MuscleType.LONG_HEAD_BICEPS,
  'short head biceps': MuscleType.SHORT_HEAD_BICEPS,
  'biceps long head': MuscleType.LONG_HEAD_BICEPS,
  'biceps short head': MuscleType.SHORT_HEAD_BICEPS,
  'triceps long head': MuscleType.LONG_HEAD_TRICEPS,
  'triceps lateral head': MuscleType.LATERAL_HEAD_TRICEPS,
  'triceps medial head': MuscleType.MEDIAL_HEAD_TRICEPS,
  'vastus lateralis': MuscleType.OUTER_QUADRICEP,
  'vastus medialis': MuscleType.INNER_QUADRICEP,
  'biceps femoris': MuscleType.LATERAL_HAMSTRINGS,
  semitendinosus: MuscleType.MEDIAL_HAMSTRINGS,
  semimembranosus: MuscleType.MEDIAL_HAMSTRINGS,
  'tibialis anterior': MuscleType.TIBIALIS,
  hand: MuscleType.HANDS,
  foot: MuscleType.FEET,
  'medial gastrocnemius': MuscleType.GASTROCNEMIUS_MEDIAL_HEAD,
  'lateral gastrocnemius': MuscleType.GASTROCNEMIUS_LATERAL_HEAD,
  'medial calf': MuscleType.GASTROCNEMIUS_MEDIAL_HEAD,
  'lateral calf': MuscleType.GASTROCNEMIUS_LATERAL_HEAD,
};

function normalize(value: string): string {
  return value
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .toLowerCase();
}

const normalizedMuscles = new Map(MUSCLES.map(muscle => [normalize(muscle), muscle]));

export function resolveMuscle(value: string): MuscleType | undefined {
  const normalized = normalize(value);
  return normalizedMuscles.get(normalized) ?? (Object.hasOwn(aliases, normalized) ? aliases[normalized] : undefined);
}

const labels: Partial<Readonly<Record<MuscleType, string>>> = {
  [MuscleType.LATS]: 'Latissimus dorsi',
  [MuscleType.UPPER_PECTORALIS]: 'Upper pectoralis',
  [MuscleType.MID_LOWER_PECTORALIS]: 'Mid / lower pectoralis',
  [MuscleType.OUTER_QUADRICEP]: 'Vastus lateralis · outer quadriceps',
  [MuscleType.INNER_QUADRICEP]: 'Vastus medialis · inner quadriceps',
  [MuscleType.INNER_THIGH]: 'Adductors · inner thigh',
  [MuscleType.TIBIALIS]: 'Tibialis anterior',
  [MuscleType.LONG_HEAD_BICEPS]: 'Biceps · long head',
  [MuscleType.SHORT_HEAD_BICEPS]: 'Biceps · short head',
  [MuscleType.LONG_HEAD_TRICEPS]: 'Triceps · long head',
  [MuscleType.LATERAL_HEAD_TRICEPS]: 'Triceps · lateral head',
  [MuscleType.MEDIAL_HEAD_TRICEPS]: 'Triceps · medial head',
  [MuscleType.GASTROCNEMIUS_MEDIAL_HEAD]: 'Gastrocnemius · medial head',
  [MuscleType.GASTROCNEMIUS_LATERAL_HEAD]: 'Gastrocnemius · lateral head',
};

export function getMuscleLabel(muscle: MuscleType): string {
  if (labels[muscle]) return labels[muscle];
  return muscle.replace(/-/g, ' ').replace(/\b\w/g, (letter) => letter.toUpperCase());
}
