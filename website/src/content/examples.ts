export const quickStart = `import createMuscleGraph from 'muscle-graph';

const host = document.querySelector<HTMLElement>('#body-map');
if (!host) throw new Error('Missing #body-map');

const graph = createMuscleGraph({
  container: host,
  bodyType: 'male',
  data: [{ name: 'Bench press', muscles: ['chest'], frequency: 3 }],
  onClick: ({ muscle, data }) => {
    console.log(muscle, data.frequency);
  },
});`;

export const angularExample = `import {
  afterNextRender, Component, DestroyRef, ElementRef,
  effect, inject, Injector, input, viewChild,
} from '@angular/core';
import createMuscleGraph, {
  type ExerciseData, type MuscleGraphInstance,
} from 'muscle-graph';

@Component({
  selector: 'app-muscle-map',
  template: '<div #host></div>',
})
export class MuscleMapComponent {
  readonly data = input<readonly ExerciseData[]>([]);
  readonly bodyType = input<'male' | 'female'>('male');
  private readonly host = viewChild.required<ElementRef<HTMLElement>>('host');
  private readonly destroyRef = inject(DestroyRef);
  private readonly injector = inject(Injector);
  private graph?: MuscleGraphInstance;

  constructor() {
    afterNextRender(() => {
      this.graph = createMuscleGraph({ container: this.host().nativeElement });
      effect(() => {
        this.graph?.update({ data: this.data(), bodyType: this.bodyType() });
      }, { injector: this.injector });
      this.destroyRef.onDestroy(() => this.graph?.destroy());
    });
  }
}`;

export const reactExample = `import { useEffect, useRef } from 'react';
import createMuscleGraph, {
  type ExerciseData, type MuscleGraphInstance,
} from 'muscle-graph';

export function MuscleMap({ data }: { data: readonly ExerciseData[] }) {
  const host = useRef<HTMLDivElement>(null);
  const graph = useRef<MuscleGraphInstance | undefined>(undefined);

  useEffect(() => {
    if (!host.current) return;
    graph.current = createMuscleGraph({ container: host.current });
    return () => {
      graph.current?.destroy();
      graph.current = undefined;
    };
  }, []);

  useEffect(() => { graph.current?.update({ data }); }, [data]);
  return <div ref={host} />;
}`;

export const vueExample = `<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref, watch } from 'vue';
import createMuscleGraph, {
  type ExerciseData, type MuscleGraphInstance,
} from 'muscle-graph';

const props = defineProps<{ data: readonly ExerciseData[] }>();
const host = ref<HTMLElement>();
let graph: MuscleGraphInstance | undefined;

onMounted(() => {
  graph = createMuscleGraph({ container: host.value, data: props.data });
});
watch(() => props.data, data => graph?.update({ data }));
onBeforeUnmount(() => graph?.destroy());
</script>

<template><div ref="host" /></template>`;
