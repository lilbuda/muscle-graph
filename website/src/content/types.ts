export interface DocSection {
  readonly id: string;
  readonly title: string;
  readonly html: string;
}
export interface Page {
  readonly path: string;
  readonly title: string;
  readonly description: string;
  readonly group: string;
  readonly sections: readonly DocSection[];
}
