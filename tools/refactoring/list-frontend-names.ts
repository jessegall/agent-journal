/**
 * Lists every name the frontend declares at the top level of its .ts and .vue files, as "type<TAB>name<TAB>file:line",
 * which name-faults.php judges with every other name of the project.
 *
 *   node --experimental-strip-types tools/refactoring/list-frontend-names.ts resources/js domain
 */
import { lstatSync, readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { frontendNamesOf, nameLine, type DeclaredName } from './frontendNames.ts';

type Placed = DeclaredName & { file: string };

const SKIPPED_FOLDERS = new Set(['node_modules', 'vendor', 'generated', 'actions', 'routes', 'wayfinder', 'testdata']);

process.argv
    .slice(2)
    .flatMap(namesUnder)
    .forEach((declared) => console.log(`${nameLine(declared)}\t${declared.file}:${declared.line}`));

function namesUnder(folder: string): Placed[] {
    return sourceFiles(folder).flatMap((file) =>
        frontendNamesOf(file, readFileSync(file, 'utf8')).map((declared) => ({ ...declared, file })),
    );
}

function sourceFiles(folder: string): string[] {
    // a file named on its own, as the staged files of a commit are
    if (!lstatSync(folder).isDirectory()) {
        return /\.(ts|vue)$/.test(folder) && !/\.(test|d)\.ts$/.test(folder) ? [folder] : [];
    }

    return readdirSync(folder).flatMap((entry) => {
        const path = join(folder, entry);

        if (lstatSync(path).isDirectory()) {
            return SKIPPED_FOLDERS.has(entry) ? [] : sourceFiles(path);
        }

        return /\.(ts|vue)$/.test(entry) && !/\.(test|d)\.ts$/.test(entry) ? [path] : [];
    });
}
