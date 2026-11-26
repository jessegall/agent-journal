/**
 * Renames frontend names in the .ts and .vue files from the TypeScript language service with Vue's language plugin,
 * the service vue-tsc checks with: each declaration and every reference to it, template uses included. The project
 * is loaded once for the whole list, every rename is worked out on it, and each file is written once.
 *
 *   node tools/refactoring/rename-frontend.cjs --list=<file>      lines "<file>:<line> <old name> <new name>"
 *   node tools/refactoring/rename-frontend.cjs ... --dry-run      print the edits, write nothing
 *   node tools/refactoring/rename-frontend.cjs ... --project=<dir>  the folder whose tsconfig.json is loaded, the checkout's by default
 */
const fs = require('node:fs');
const path = require('node:path');
const ts = require('typescript');
const vue = require('@vue/language-core');
const { createLanguage } = require('@volar/language-core');
const { createLanguageServiceHost } = require('@volar/typescript');

const options = process.argv.slice(2);
const root = path.resolve(options.find((option) => option.startsWith('--project='))?.slice('--project='.length) ?? path.join(__dirname, '..', '..'));
const listFile = options.find((option) => option.startsWith('--list='))?.slice('--list='.length);
const isDryRun = options.includes('--dry-run');

if (listFile === undefined) {
    console.error('Name the renames with --list=<file>, one "<file>:<line> <old name> <new name>" to a line.');
    process.exit(2);
}

const { service, textOf, sourceStartOf, generatedPositionOf } = languageService();
const editsByFile = new Map();
let refused = 0;

for (const [place, oldName, newName] of listedRenames(listFile)) {
    const [file, line] = place.split(':');
    const fileName = path.resolve(root, file);
    const sourcePosition = positionOf(textOf(fileName), Number(line), oldName);
    const position = sourcePosition === null ? null : generatedPositionOf(fileName, sourcePosition);
    const locations = position === null ? undefined : service.findRenameLocations(fileName, position, false, false, {
        providePrefixAndSuffixTextForRename: true,
    });

    if (locations === undefined || locations.length === 0) {
        refused++;
        console.error(`Refused ${place} ${oldName}: no declaration of it there`);
        continue;
    }

    const places = new Set();

    for (const location of locations) {
        const start = sourceStartOf(location);

        // Only a place whose source text is the old name is renamed; Vue's generated code that maps nowhere is left.
        if (start === null || textOf(location.fileName).slice(start, start + oldName.length) !== oldName) {
            continue;
        }

        const edits = editsByFile.get(location.fileName) ?? [];
        // A shorthand property keeps its key: { grab } becomes { grab: grabbing } when the local is renamed.
        edits.push({ start, length: oldName.length, text: `${location.prefixText ?? ''}${newName}${location.suffixText ?? ''}` });
        editsByFile.set(location.fileName, edits);
        places.add(`${location.fileName}:${start}`);
    }

    console.log(`${isDryRun ? 'Would rename' : 'Renamed'} ${place} ${oldName} ${newName}: ${places.size} place(s)`);
}

if (!isDryRun) {
    for (const [fileName, edits] of editsByFile) {
        fs.writeFileSync(fileName, edited(textOf(fileName), edits));
    }
}

process.exit(refused > 0 ? 1 : 0);

/**
 * The language service over every file of the project's tsconfig, with .vue files read through Vue's plugin, and the
 * one funnel every file is read through: each file is read once, and the service is built once per run.
 */
function languageService() {
    if (languageService.isBuilt) {
        throw new Error('The language service would be built a second time; a run renames on its one load.');
    }

    languageService.isBuilt = true;
    const configFile = path.join(root, 'tsconfig.json');
    // TypeScript lists the files, .vue included as an extra extension; Vue's own reading of the config gives its options.
    const config = ts.getParsedCommandLineOfConfigFile(
        configFile,
        {},
        { ...ts.sys, onUnRecoverableConfigFileDiagnostic: () => {} },
        undefined,
        undefined,
        [{ extension: 'vue', isMixedContent: true, scriptKind: ts.ScriptKind.Deferred }],
    );
    const { vueOptions } = vue.createParsedCommandLine(ts, ts.sys, configFile);
    const plugin = vue.createVueLanguagePlugin(ts, config.options, vueOptions, (id) => id);
    const snapshots = new Map();
    const texts = new Map();
    const textOf = (fileName) => {
        if (!texts.has(fileName)) {
            texts.set(fileName, fs.existsSync(fileName) ? fs.readFileSync(fileName, 'utf8') : undefined);
        }

        return texts.get(fileName);
    };
    const snapshotOf = (fileName) => {
        if (!snapshots.has(fileName)) {
            const text = textOf(fileName);
            snapshots.set(fileName, text === undefined ? undefined : ts.ScriptSnapshot.fromString(text));
        }

        return snapshots.get(fileName);
    };
    const language = createLanguage([plugin, { getLanguageId: languageIdOf }], new Map(), (fileName) => {
        const snapshot = snapshotOf(fileName);

        if (snapshot === undefined) {
            language.scripts.delete(fileName);
        } else {
            language.scripts.set(fileName, snapshot);
        }
    });
    const { languageServiceHost } = createLanguageServiceHost(ts, ts.sys, language, (fileName) => fileName, {
        getCurrentDirectory: () => root,
        getCompilationSettings: () => config.options,
        getScriptFileNames: () => config.fileNames,
        getProjectReferences: () => config.projectReferences,
        getProjectVersion: () => '1',
    });
    const service = ts.createLanguageService(languageServiceHost);
    // TypeScript reads a .vue file as the code Vue generates for it; its source map takes an offset either way, and an
    // offset in generated code that maps nowhere is no place in the source.
    const mapOf = (fileName) => {
        const sourceScript = language.scripts.get(fileName);
        const serviceScript = sourceScript.generated.languagePlugin.typescript.getServiceScript(sourceScript.generated.root);

        return language.maps.get(serviceScript.code, sourceScript);
    };
    const sourceStartOf = (location) => {
        if (!location.fileName.endsWith('.vue')) {
            return location.textSpan.start;
        }

        const [first] = mapOf(location.fileName).toSourceLocation(location.textSpan.start);

        return first === undefined ? null : first[0];
    };
    const generatedPositionOf = (fileName, sourceOffset) => {
        if (!fileName.endsWith('.vue')) {
            return sourceOffset;
        }

        const [first] = mapOf(fileName).toGeneratedLocation(sourceOffset);

        return first === undefined ? null : first[0];
    };
    return { service, textOf, sourceStartOf, generatedPositionOf };
}

/**
 * The language a file is written in, by its extension.
 */
function languageIdOf(fileName) {
    const languages = { '.vue': 'vue', '.tsx': 'typescriptreact', '.jsx': 'javascriptreact', '.js': 'javascript', '.mjs': 'javascript', '.cjs': 'javascript', '.json': 'json' };

    return languages[path.extname(fileName)] ?? 'typescript';
}

/**
 * The renames of the list file, one "<file>:<line> <old name> <new name>" to a line; # lines are notes.
 */
function listedRenames(file) {
    return fs
        .readFileSync(file, 'utf8')
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line !== '' && !line.startsWith('#'))
        .map((line) => line.split(/\s+/));
}

/**
 * The offset of the name on its line, matched as a whole word, or null when the line does not hold it.
 */
function positionOf(text, line, name) {
    const lines = text.split('\n');
    const column = lines[line - 1]?.search(new RegExp(`\\b${name}\\b`)) ?? -1;

    if (column < 0) {
        return null;
    }

    return lines.slice(0, line - 1).reduce((offset, text) => offset + text.length + 1, 0) + column;
}

/**
 * The text with the edits made, last first so the earlier offsets still hold; an edit twice at one place is made once.
 */
function edited(text, edits) {
    const unique = [...new Map(edits.map((edit) => [edit.start, edit])).values()].sort((first, second) => second.start - first.start);

    return unique.reduce((result, edit) => result.slice(0, edit.start) + edit.text + result.slice(edit.start + edit.length), text);
}
