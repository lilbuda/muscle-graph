export interface BodyPart {
  readonly slug: string;
  readonly color?: string;
  readonly path: {
    readonly common?: readonly string[];
    readonly left?: readonly string[];
    readonly right?: readonly string[];
  };
}
