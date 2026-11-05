import type { MuscleType } from './muscles.js';

export type BodyType = 'male' | 'female';
export type ModelType = 'anterior' | 'posterior';
export type MuscleInput = MuscleType | string;
export type StyleMap = Readonly<Record<string, string | number>>;

export interface ExerciseData {
  readonly name: string;
  readonly muscles: readonly MuscleInput[];
  readonly frequency?: number;
}

export interface MuscleData {
  readonly exercises: readonly string[];
  readonly frequency: number;
}

export interface MuscleStats {
  readonly muscle: MuscleType;
  readonly data: MuscleData;
}

export interface MuscleGraphOptions {
  readonly container?: HTMLElement;
  readonly data?: readonly ExerciseData[];
  readonly type?: ModelType;
  readonly bodyType?: BodyType;
  readonly bodyColor?: string;
  readonly bodyFillColor?: string;
  readonly highlightedColors?: readonly string[];
  /** Overrides merge on update. Set a key to null to restore its inherited color. */
  readonly muscleColors?: Partial<Readonly<Record<MuscleType, string | null>>>;
  readonly outlineColor?: string;
  readonly bodyOutlineColor?: string;
  readonly hoverColor?: string;
  readonly backgroundColor?: string;
  readonly wrapperClassName?: string;
  readonly style?: StyleMap;
  readonly svgStyle?: StyleMap;
  readonly ariaLabel?: string;
  readonly onClick?: (stats: MuscleStats) => void;
  readonly onMouseEnter?: (stats: MuscleStats) => void;
  readonly onMouseLeave?: (stats: MuscleStats) => void;
}

export interface MuscleGraphInstance {
  readonly element: HTMLElement;
  update(options: Partial<MuscleGraphOptions>): void;
  destroy(): void;
  getStats(muscle: MuscleInput): MuscleStats | undefined;
}
