// Checks that each domain's browser code imports only what it may: its own files, @domain/<itself>, @kit, its own
// generated types and routes, and packages. Web, the shell, may also use @/. The owners and their folders come from
// resources/js/generated/domain-roots.json, written by php artisan journal:client-manifest from the same registry.
// Usage: node scripts/check-domain-imports.mjs [roots.json] [project root]
import { existsSync, readdirSync, readFileSync, realpathSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import ts from 'typescript';
import { parse } from 'vue/compiler-sfc';

const projectRoot = resolve(process.argv[3] ?? process.cwd());
const rootsFile = resolve(process.argv[2] ?? join(projectRoot, 'resources/js/generated/domain-roots.json'));
const owners = JSON.parse(readFileSync(rootsFile, 'utf8')).owners;
const shellOwner = 'web';

/**
 * Every .ts and .vue file under a folder, generated output left out.
 */
function sourceFiles(folder) {
    return readdirSync(folder).flatMap((name) => {
        const path = join(folder, name);

        if (statSync(path).isDirectory()) {
            return name === 'generated' ? [] : sourceFiles(path);
        }

        return /\.(ts|vue)$/.test(name) ? [path] : [];
    });
}

/**
 * The script text of a file: a .ts file whole, a .vue file's script and script setup blocks.
 */
function scriptsOf(path) {
    const text = readFileSync(path, 'utf8');

    if (!path.endsWith('.vue')) {
        return [text];
    }

    const { descriptor } = parse(text, { filename: path });

    return [descriptor.script?.content, descriptor.scriptSetup?.content].filter((content) => content !== undefined);
}

/**
 * Every module a script names: static imports and exports, and dynamic imports, which must be literal.
 */
function specifiersOf(script, path) {
    const found = [];
    const source = ts.createSourceFile(path, script, ts.ScriptTarget.Latest, true);

    function visit(node) {
        if ((ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) && node.moduleSpecifier !== undefined) {
            found.push(node.moduleSpecifier.text);
        }

        if (ts.isCallExpression(node) && node.expression.kind === ts.SyntaxKind.ImportKeyword) {
            const argument = node.arguments[0];
            found.push(argument !== undefined && ts.isStringLiteral(argument) ? argument.text : null);
        }

        ts.forEachChild(node, visit);
    }

    visit(source);

    return found;
}

/**
 * Why an import is refused, or null when the owner may make it.
 */
function refusalOf(owner, ownFolder, file, specifier) {
    if (specifier === null) {
        return 'an import whose path is not written out cannot be proven to stay in the domain';
    }

    if (specifier.startsWith('.')) {
        const written = resolve(dirname(file), specifier);
        // A path without its extension is still judged by where it points.
        const target = existsSync(written) ? realpathSync(written) : written;

        return target === ownFolder || target.startsWith(ownFolder + sep) ? null : 'a relative path leaves the domain';
    }

    const [first, second, third] = specifier.split('/');

    if (first === '@domain') {
        return second === owner ? null : `another domain's component (@domain/${second})`;
    }

    if (first === '@generated') {
        const isOwnGenerated = (second === 'types' || second === 'routes') && third === owner;

        // The shell may import everything under @/, the generated types and routes of every owner among it.
        return isOwnGenerated || owner === shellOwner ? null : `another owner's generated ${second}`;
    }

    if (first === '@kit') {
        return null;
    }

    if (first === '@') {
        return owner === shellOwner ? null : 'the shell (@/) is not a domain\'s to import';
    }

    return specifier.startsWith('/') ? 'an absolute path' : null;
}

/**
 * Every refused import of one file, each as the line the check prints.
 */
function fileRefusals(owner, ownFolder, file) {
    return scriptsOf(file)
        .flatMap((script) => specifiersOf(script, file))
        .map((specifier) => [specifier, refusalOf(owner, ownFolder, file, specifier)])
        .filter(([, refusal]) => refusal !== null)
        .map(([specifier, refusal]) => {
            const written = specifier ?? '(an import without a written path)';

            return `${relative(projectRoot, file)}: ${written}: ${refusal}`;
        });
}

const refusals = Object.entries(owners).flatMap(([owner, folder]) => {
    const ownFolder = realpathSync(resolve(projectRoot, folder));

    return sourceFiles(ownFolder).flatMap((file) => fileRefusals(owner, ownFolder, file));
});

if (refusals.length > 0) {
    console.error(`Domain imports refused (${refusals.length}):\n${refusals.join('\n')}`);
    process.exit(1);
}

console.log(`Domain imports checked: ${Object.keys(owners).length} owners.`);
