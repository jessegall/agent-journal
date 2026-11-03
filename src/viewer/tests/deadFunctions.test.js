import {readdirSync, readFileSync} from "node:fs";
import {join, relative, resolve} from "node:path";
import {babelParse} from "vue/compiler-sfc";
import {expect, test} from "vitest";

const ROOT = resolve(__dirname, "../../..");
const FOLDERS = ["src/viewer", "src/core/modules", "src/suites", "src/tunnels"];
const CHECKED = ["src/viewer/src", "src/viewer/kit", "src/core/modules", "src/suites", "src/tunnels"];
const SKIPPED = new Set(["node_modules", "dist", ".vite"]);
const EXTENSIONS = [".js", ".vue", ".ts", ".mjs", ".html"];
// the figure's port from version 4, by file, with the task that wired each into the chat; some of their exported functions are used only by their tests
const FIGURE_PORT = {
    "src/viewer/src/figure/": 5661,
    "src/viewer/src/domain/figureState.js": 5661,
    "src/viewer/src/domain/figureMotion.js": 5661,
    "src/viewer/src/domain/falls.js": 5661,
};
// modules a frame window imports by their address, which no file of this repository imports
const PUBLIC_MODULES = ["src/viewer/kit/frameBridgeClient.js"];
const IMPORT =/import\s*([^;'"]*?)\s*from\s*["'][^"']+["']|export\s*\{([^}]*)\}\s*from\s*["'][^"']+["']/g;

const isTest = (path) => /(^|\/)tests?\//.test(path) || /\.test\.js$/.test(path);
const isWindowCode = (path) => path.endsWith(".js") && (path.startsWith("src/viewer/") || path.includes("/web/src/"));

function filesUnder(folder) {
    return readdirSync(folder, {withFileTypes: true}).flatMap((entry) => {
        if (SKIPPED.has(entry.name)) return [];
        const path = join(folder, entry.name);
        return entry.isDirectory() ? filesUnder(path) : [path];
    });
}

const isFunction = (node) => node && ["ArrowFunctionExpression", "FunctionExpression"].includes(node.type);

function exportedFunctions(source) {
    const names = [];
    for (const statement of babelParse(source, {sourceType: "module", plugins: ["jsx"]}).program.body) {
        const declaration = statement.type === "ExportNamedDeclaration" && !statement.source ? statement.declaration : null;
        if (declaration && declaration.type === "FunctionDeclaration") names.push(declaration.id.name);
        if (declaration && declaration.type === "VariableDeclaration") {
            names.push(...declaration.declarations.filter((one) => one.id.type === "Identifier" && isFunction(one.init)).map((one) => one.id.name));
        }
    }
    return names;
}

// the names a file imports or re-exports from another, as they are named where they are defined
function importedNames(source) {
    const names = new Set();
    for (const match of source.matchAll(IMPORT)) {
        const braces = (match[1] || "").match(/\{([^}]*)\}/);
        for (const part of ((braces ? braces[1] : match[2]) || "").split(",")) {
            const name = part.trim().split(/\s+as\s+/)[0];
            if (name) names.add(name);
        }
    }
    return names;
}

// the names a file calls as a bare call, which it does not declare itself: a local function of the same name is another function
function calledNames(source) {
    const declared = new Set([...source.matchAll(/(?:function\s+|(?:const|let|var)\s+)([A-Za-z_$][\w$]*)/g)].map((match) => match[1]));
    const withoutDeclarations = source.replace(/function\s+[A-Za-z_$][\w$]*/g, "function");
    return new Set([...withoutDeclarations.matchAll(/(?<![\w$.])([A-Za-z_$][\w$]*)\s*\(/g)].map((match) => match[1]).filter((name) => !declared.has(name)));
}

function usesByName() {
    const files = new Map();
    const files_ = FOLDERS.flatMap((folder) => filesUnder(join(ROOT, folder))).filter((path) => EXTENSIONS.some((ending) => path.endsWith(ending)));
    for (const file of files_.filter((path) => !isTest(relative(ROOT, path)))) {
        const source = readFileSync(file, "utf8");
        for (const name of new Set([...importedNames(source), ...calledNames(source)])) {
            if (!files.has(name)) files.set(name, new Set());
            files.get(name).add(file);
        }
    }
    return files;
}

test("every exported function of the viewer and of the windows is imported or called by another file that is no test", () => {
    const uses = usesByName();
    const unused = [];
    for (const file of CHECKED.flatMap((folder) => filesUnder(join(ROOT, folder))).filter((path) => isWindowCode(relative(ROOT, path)) && !isTest(relative(ROOT, path)))) {
        const mine = relative(ROOT, file);
        if (PUBLIC_MODULES.includes(mine) || Object.keys(FIGURE_PORT).some((port) => mine.startsWith(port))) continue;
        for (const name of exportedFunctions(readFileSync(file, "utf8"))) {
            if (![...(uses.get(name) || [])].some((other) => other !== file)) unused.push(`${mine}: ${name}`);
        }
    }
    expect(unused, "remove these, or stop exporting the ones their own file uses").toEqual([]);
});

test("the figure port is listed with the task that uses it", () => {
    expect(Object.values(FIGURE_PORT).every((task) => Number.isInteger(task))).toBe(true);
});
