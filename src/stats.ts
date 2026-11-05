import { getMuscleDescendants, getMuscleParents, MUSCLES, resolveMuscle, type MuscleType } from './muscles.js';
import type { ExerciseData, MuscleData, MuscleStats } from './types.js';

export function calculateMuscleStats(data: readonly ExerciseData[] = []): ReadonlyMap<MuscleType, MuscleData> {
  const mutable = new Map<MuscleType, { exercises: string[]; frequency: number }>();

  for (const muscle of MUSCLES) {
    mutable.set(muscle, { exercises: [], frequency: 0 });
  }

  for (const exercise of data) {
    const frequency = Number.isFinite(exercise.frequency) ? Math.max(0, exercise.frequency ?? 1) : 1;
    const inputs = exercise.muscles.map((muscle) => resolveMuscle(muscle)).filter(isMuscle);
    const muscles = new Set(inputs.flatMap((muscle) => [muscle, ...getMuscleDescendants(muscle), ...getMuscleParents(muscle)]));
    for (const muscle of muscles) {
      const stats = mutable.get(muscle);
      if (!stats) continue;
      stats.frequency += frequency;
      stats.exercises.push(exercise.name);
    }
  }

  return new Map(
    [...mutable.entries()].map(([muscle, stats]) => [
      muscle,
      Object.freeze({ exercises: Object.freeze([...stats.exercises]), frequency: stats.frequency }),
    ]),
  );
}

export function toMuscleStats(
  muscle: MuscleType,
  stats: ReadonlyMap<MuscleType, MuscleData>,
): MuscleStats {
  return Object.freeze({
    muscle,
    data: stats.get(muscle) ?? Object.freeze({ exercises: Object.freeze([]), frequency: 0 }),
  });
}

function isMuscle(value: MuscleType | undefined): value is MuscleType {
  return value !== undefined;
}
