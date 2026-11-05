import { mkdir, readFile, readdir, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';

// CommonJS consumers need declarations with the same module identity as the
// .cjs runtime entry. Keep both declaration trees generated from the TS source.
const sourceDirectory = 'dist/types';
for (const file of await readdir(sourceDirectory, { recursive: true })) {
  if (!file.endsWith('.d.ts')) continue;
  const target = join('dist/types-cjs', file.replace(/\.d\.ts$/, '.d.cts'));
  const source = await readFile(join(sourceDirectory, file), 'utf8');
  const declaration = source
    .replace(/(from ['"][^'"]+)\.js(['"])/g, '$1.cjs$2')
    .replace(/\/\/# sourceMappingURL=.*$/gm, '');
  await mkdir(dirname(target), { recursive: true });
  await writeFile(target, declaration);
}
