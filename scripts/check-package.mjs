import assert from 'node:assert/strict';
import { execFileSync } from 'node:child_process';
import { mkdir, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

const fixtureDirectory = '.npm-cache/package-check';
await mkdir(fixtureDirectory, { recursive: true });
const fixture = `import createMuscleGraph, { MuscleType, type MuscleGraphOptions } from 'muscle-graph';
const options: MuscleGraphOptions = { interactive: false, muscleColors: { [MuscleType.CHEST]: null } };
const create: typeof createMuscleGraph = createMuscleGraph;
void options;
void create;
`;
const files = ['consumer.mts', 'consumer.cts'].map(file => `${fixtureDirectory}/${file}`);
for (const file of files) await writeFile(file, fixture);
execFileSync(process.execPath, [
  'node_modules/typescript/bin/tsc', '--ignoreConfig', '--noEmit', '--strict',
  '--module', 'nodenext', '--moduleResolution', 'nodenext', '--target', 'es2022', ...files,
], { stdio: 'inherit' });

const esm = await import('muscle-graph');
const cjs = createRequire(import.meta.url)('muscle-graph');
for (const library of [esm, cjs]) {
  assert.equal(typeof library.createMuscleGraph, 'function');
  assert.equal(typeof library.default, 'function');
  assert.throws(() => library.createMuscleGraph(), /requires a DOM/);
  const stats = library.calculateMuscleStats([{ name: 'Press', muscles: ['chest'] }]);
  assert.equal(stats.get(library.MuscleType.CHEST)?.frequency, 1);
}
console.log('ESM/CommonJS types, exports and server imports passed.');
