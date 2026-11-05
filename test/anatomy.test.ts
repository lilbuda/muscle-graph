// @vitest-environment node
import { describe, expect, it } from 'vitest';
import { getAnatomy } from '../src/advanced-geometry';
import { bodyFemaleFront } from '../src/anatomy/bodyFemaleFront';
import { bodyFemaleBack } from '../src/anatomy/bodyFemaleBack';
import { bodyFront } from '../src/anatomy/bodyFront';
import { bodyBack } from '../src/anatomy/bodyBack';
import { ADVANCED_MUSCLES, MuscleType } from '../src/muscles';

type Point = readonly [number, number];

// The added masks contain only absolute M/L/C/Z commands. Sample their curves
// independently to check that subdivisions neither overlap nor leave holes.
function maskOutline(path: string): readonly Point[] {
  const tokens = path.match(/[MLCZ]|-?\d+(?:\.\d+)?/g) ?? [];
  const points: Point[] = [];
  let current: Point = [0, 0];
  let index = 0;
  const coordinate = (): number => Number(tokens[index++]);
  while (index < tokens.length) {
    const command = tokens[index++];
    if (command === 'M' || command === 'L') {
      current = [coordinate(), coordinate()];
      points.push(current);
    } else if (command === 'C') {
      const a: Point = [coordinate(), coordinate()];
      const b: Point = [coordinate(), coordinate()];
      const end: Point = [coordinate(), coordinate()];
      for (let sample = 1; sample <= 40; sample++) {
        const t = sample / 40;
        const u = 1 - t;
        points.push([
          u ** 3 * current[0] + 3 * u ** 2 * t * a[0] + 3 * u * t ** 2 * b[0] + t ** 3 * end[0],
          u ** 3 * current[1] + 3 * u ** 2 * t * a[1] + 3 * u * t ** 2 * b[1] + t ** 3 * end[1],
        ]);
      }
      current = end;
    }
  }
  return points;
}

function contains(points: readonly Point[], [x, y]: Point): boolean {
  let inside = false;
  for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
    const a = points[i];
    const b = points[j];
    if (a && b && (a[1] > y) !== (b[1] > y)
      && x < (b[0] - a[0]) * (y - a[1]) / (b[1] - a[1]) + a[0]) inside = !inside;
  }
  return inside;
}

const originals = {
  male: {
    anterior: { viewBox: '0 0 724 1448', count: 89, hash: '86d37de169e2ee22ca19d1d45adcdbb9b225582d7b473ec0be86006d12b9909c' },
    posterior: { viewBox: '724 0 724 1448', count: 70, hash: 'c7d083b3da883fbe8beacd9de5c697988fc70021e4ade315ed4e1a03ea4911ec' },
  },
  female: {
    anterior: { viewBox: '-50 -40 734 1538', count: 92, hash: 'f55235a810a3ab95699eb2b68de9bfe44d0251ea381f93c28495bb864c87d6e0' },
    posterior: { viewBox: '756 0 774 1448', count: 66, hash: '3f895c845b0a3b75f3af8f9ae441cb02650c3ea853f0c59a7490aa51d93175a3' },
  },
};

describe('licensed anatomy and detailed subdivisions', () => {
  // Independently audited mirror pairs from the pinned SVGs. Each index is the
  // left-side counterpart of a right-side path, based on shape and position.
  const pairedSources = [
    { bodyType: 'male', type: 'anterior', parts: bodyFront, counterparts: {
      abs: [2, 0, 1, 3],
    } },
    { bodyType: 'male', type: 'posterior', parts: bodyBack, counterparts: {
      'upper-back': [0, 2, 1], forearm: [1, 0, 2, 3],
      hamstring: [2, 1, 3, 0], calves: [0, 2, 1, 3],
    } },
    { bodyType: 'female', type: 'anterior', parts: bodyFemaleFront, counterparts: {
      abs: [3, 2, 1, 0], forearm: [3, 1, 0, 2],
    } },
    { bodyType: 'female', type: 'posterior', parts: bodyFemaleBack, counterparts: {
      triceps: [2, 0, 1], forearm: [2, 1, 0, 3], gluteal: [1, 0],
      hamstring: [1, 2, 0], calves: [2, 3, 1, 0], 'lower-back': [1, 0],
    } },
  ] as const;

  for (const { bodyType, type, parts, counterparts } of pairedSources) {
    const mirrorIndices: Readonly<Record<string, readonly number[]>> = counterparts;
    const regions = getAnatomy(bodyType, type).regions;
    const memberships = (path: string): readonly MuscleType[] => regions
      .filter(region => region.paths.includes(path)).map(region => region.muscle).sort();
    for (const part of parts) {
      const { left, right } = part.path;
      if (!left || !right) continue;
      it(`assigns matching IDs to every ${bodyType} ${type} ${part.slug} mirror pair`, () => {
        expect(right).toHaveLength(left.length);
        for (const [index, path] of right.entries()) {
          const counterpart = left[mirrorIndices[part.slug]?.[index] ?? index];
          expect(counterpart).toBeDefined();
          expect(memberships(path).length).toBeGreaterThan(0);
          expect(memberships(path), `${part.slug} right path ${index}`).toEqual(memberships(counterpart ?? ''));
        }
      });
    }
  }

  it('assigns the female lower abdominal paths correctly on both sides', () => {
    const abs = bodyFemaleFront.find(part => part.slug === 'abs');
    const regions = getAnatomy('female', 'anterior').regions;
    const lower = regions.find(region => region.muscle === MuscleType.LOWER_ABDOMINALS);
    const upper = regions.find(region => region.muscle === MuscleType.UPPER_ABDOMINALS);
    expect(lower?.paths).toEqual([abs?.path.left?.[1], abs?.path.right?.[2]]);
    expect(upper?.paths).toEqual([
      abs?.path.left?.[0], abs?.path.left?.[2], abs?.path.left?.[3],
      abs?.path.right?.[0], abs?.path.right?.[1], abs?.path.right?.[3],
    ]);
  });

  for (const bodyType of ['male', 'female'] as const) {
    it(`retains all 32 detailed muscle IDs for ${bodyType}`, () => {
      const muscles = new Set((['anterior', 'posterior'] as const).flatMap(type =>
        getAnatomy(bodyType, type).regions.map(region => region.muscle)));
      expect(ADVANCED_MUSCLES).toHaveLength(32);
      for (const muscle of ADVANCED_MUSCLES) expect(muscles.has(muscle), muscle).toBe(true);
    });

    for (const type of ['anterior', 'posterior'] as const) {
      const model = getAnatomy(bodyType, type);
      it(`preserves every original ${bodyType} ${type} path and view box`, async () => {
        const paths = [...new Set(model.regions.flatMap(region => region.paths))].sort();
        const original = originals[bodyType][type];
        expect(paths).toHaveLength(original.count);
        const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(paths.join('\n')));
        const hash = [...new Uint8Array(digest)].map(value => value.toString(16).padStart(2, '0')).join('');
        expect(hash).toBe(original.hash);
        expect(model.viewBox).toBe(original.viewBox);
        expect([model.silhouette, ...paths].join(' ')).not.toMatch(/NaN|Infinity|undefined/);
      });

      it(`partitions combined ${bodyType} ${type} paths without interior overlaps or holes`, () => {
        const masksBySource = new Map<string, string[]>();
        for (const region of model.regions) for (const [index, source] of region.paths.entries()) {
          const mask = region.clips[index];
          if (mask) masksBySource.set(source, [...(masksBySource.get(source) ?? []), mask]);
        }
        expect(masksBySource.size).toBeGreaterThan(0);
        for (const masks of masksBySource.values()) {
          const polygons = masks.map(maskOutline);
          const points = polygons.flat();
          const minX = Math.min(...points.map(point => point[0]));
          const maxX = Math.max(...points.map(point => point[0]));
          const minY = Math.min(...points.map(point => point[1]));
          const maxY = Math.max(...points.map(point => point[1]));
          for (let row = 1; row < 30; row++) for (let column = 1; column < 30; column++) {
            const point: Point = [minX + (maxX - minX) * column / 30, minY + (maxY - minY) * row / 30];
            expect(polygons.filter(polygon => contains(polygon, point)), `${bodyType} ${type} at ${point}`).toHaveLength(1);
          }
        }
      });

      it(`keeps complete hands and feet for ${bodyType} ${type}`, () => {
        expect(model.regions.find(region => region.muscle === MuscleType.HANDS)?.paths).toHaveLength(12);
        expect(model.regions.find(region => region.muscle === MuscleType.FEET)?.paths).toHaveLength(type === 'anterior' ? 4 : 2);
      });
    }

    it(`maps separate posterior calf heads and soleus for ${bodyType}`, () => {
      const regions = getAnatomy(bodyType, 'posterior').regions;
      expect(regions.find(region => region.muscle === MuscleType.GASTROCNEMIUS_MEDIAL_HEAD)?.paths).toHaveLength(2);
      expect(regions.find(region => region.muscle === MuscleType.GASTROCNEMIUS_LATERAL_HEAD)?.paths).toHaveLength(2);
      expect(regions.find(region => region.muscle === MuscleType.SOLEUS)?.paths).toHaveLength(4);
    });
  }
});
