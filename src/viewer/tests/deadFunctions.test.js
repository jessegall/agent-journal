import {readdirSync, readFileSync} from "node:fs";
import {join, relative, resolve} from "node:path";
import {babelParse} from "vue/compiler-sfc";
import {expect, test} from "vitest";

const ROOT = resolve(__dirname, "../../..");
const FOLDERS = ["src/viewer", "src/core/modules", "src/suites", "src/tunnels"];
const CHECKED = ["src/viewer/src", "src/viewer/kit"];
const SKIPPED = new Set(["node_modules", "dist", ".vite"]);
const EXTENSIONS = [".js", ".vue", ".ts", ".mjs", ".html"];
// the figure's port from version 4, whose functions task 5661 wires into the chat next
const FIGURE_PORT = ["src/viewer/src/figure/", "src/viewer/src/domain/figureState.js", "src/viewer/src/domain/figureMotion.js", "src/viewer/src/domain/falls.js"];

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

function filesNaming() {
    const files = new Map();
    for (const file of FOLDERS.flatMap((folder) => filesUnder(join(ROOT, folder))).filter((path) => EXTENSIONS.some((ending) => path.endsWith(ending)))) {
        for (const name of new Set(readFileSync(file, "utf8").match(/[A-Za-z_$][\w$]*/g) || [])) {
            if (!files.has(name)) files.set(name, new Set());
            files.get(name).add(file);
        }
    }
    return files;
}

test("every exported function of the viewer is named in another file", () => {
    const naming = filesNaming();
    const unused = [];
    for (const file of CHECKED.flatMap((folder) => filesUnder(join(ROOT, folder))).filter((path) => path.endsWith(".js"))) {
        const mine = relative(ROOT, file);
        if (FIGURE_PORT.some((port) => mine.startsWith(port))) continue;
        for (const name of exportedFunctions(readFileSync(file, "utf8"))) {
            if (![...(naming.get(name) || [])].some((other) => other !== file)) unused.push(`${mine}: ${name}`);
        }
    }
    expect(unused, "remove these, or stop exporting the ones their own file uses").toEqual([]);
});
