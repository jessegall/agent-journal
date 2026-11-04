import {readFileSync, readdirSync} from "node:fs";
import {createRequire} from "node:module";
import {dirname, relative, resolve} from "node:path";
import {fileURLToPath} from "node:url";
import {execFileSync} from "node:child_process";

const project = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const require = createRequire(resolve(project, "src/viewer/package.json"));
const {parse: parseVue} = require("@vue/compiler-sfc");
const {parse: parseTemplate} = require("@vue/compiler-dom");
const {parse, parseExpression} = require("@babel/parser");
const textFields = new Set(["label", "title", "hint", "heading", "placeholder", "help", "line", "note", "empty", "empty-value", "aria-label", "alt", "tooltip", "description", "caption", "text", "message", "abstract"]);
const excluded = new Set(["tests", "test", "dist", "build", "node_modules", "__pycache__", "migrations"]);

function files(folder) {
    return readdirSync(folder, {withFileTypes: true}).flatMap((entry) => {
        if (excluded.has(entry.name) || entry.name.startsWith(".")) return [];
        const path = resolve(folder, entry.name);
        return entry.isDirectory() ? files(path) : [path];
    });
}

function walk(node, visit, parents = []) {
    if (!node || typeof node !== "object") return;
    if (node.type) visit(node, parents);
    for (const [key, value] of Object.entries(node)) {
        if (["loc", "tokens", "comments", "errors"].includes(key)) continue;
        const children = Array.isArray(value) ? value : [value];
        for (const child of children) walk(child, visit, [node, ...parents]);
    }
}

function strings(node, add) {
    walk(node, (value, parents) => {
        if (value.type === "StringLiteral" && !(parents[0]?.type === "ObjectProperty" && parents[0].key === value)) add(value.loc.start.line, value.value);
        if (value.type === "TemplateLiteral") add(value.loc.start.line, value.quasis.map((part, index) => part.value.cooked + (index < value.expressions.length ? "${…}" : "")).join(""));
    });
}

function script(source, add) {
    const tree = parse(source, {sourceType: "module", plugins: ["typescript"]});
    walk(tree, (node, parents) => {
        const name = node.key?.name ?? node.key?.value ?? node.id?.name;
        if (textFields.has(name) || /(?:LABELS|WORDS|TITLES|OPTIONS|PRESETS)$/.test(name)) strings(node.value ?? node.init, add);
        if (["StringLiteral", "TemplateLiteral"].includes(node.type)) {
            const value = node.value ?? node.quasis.map((part) => part.value.cooked).join("${…}");
            const parent = parents[0];
            if (parent?.type === "ImportDeclaration" || parent?.key === node) return;
            if (/\s/.test(value) && /[a-z]/i.test(value) && !/^(?:[.#/@<]|--|(?:uniform|attribute|varying|void)\b|(?:journal )?[a-z-]+ (?:list|show|make|set|read|find)\b)/.test(value)) add(node.loc.start.line, value);
        }
    });
}

function vue(source, add) {
    const {descriptor} = parseVue(source);
    for (const block of [descriptor.script, descriptor.scriptSetup]) {
        if (block) script(block.content, (line, value) => add(line + block.loc.start.line - 1, value));
    }
    if (!descriptor.template) return;
    const block = descriptor.template;
    const template = parseTemplate(block.content);
    function visit(node) {
        const line = node.loc.start.line + block.loc.start.line - 1;
        if (node.type === 2) add(line, node.content);
        if (node.type === 5) strings(parseExpression(node.content.content), (_, value) => add(line, value));
        for (const prop of node.props ?? []) {
            const propLine = prop.loc.start.line + block.loc.start.line - 1;
            if (prop.type === 6 && textFields.has(prop.name) && prop.value) add(propLine, prop.value.content);
            if (prop.type === 7 && prop.name === "bind" && textFields.has(prop.arg?.content) && prop.exp) strings(parseExpression(prop.exp.content), (_, value) => add(propLine, value));
        }
        for (const child of node.children ?? []) visit(child);
    }
    visit(template);
}

const pythonInventory = String.raw`
import ast
import json
import sys
from pathlib import Path

root = Path(sys.argv[1])
fields = set(sys.argv[2].split(',')) | {'group_label', 'button_label'}
positions = {'WindowDeclaration': (1,), 'WindowSearch': (1,), 'WindowReadSearch': (1,),
             'ChoiceOption': (1,), 'ToggleOption': (1,), 'MarkDeclaration': (3,),
             'MarkFamily': (1,), 'MarkButton': (1,), 'SettingValue': (1, 2), 'SettingGroup': (1, 2),
             'LayoutPreset': (1, 2)}
records = []
def collect(path, node):
    for value in ast.walk(node):
        if isinstance(value, ast.Constant) and isinstance(value.value, str) and value.value.strip():
            records.append([str(path.relative_to(root)), value.lineno, value.value])
for path in sorted((root / 'src').rglob('*.py')):
    if {'tests', 'test', 'dist', 'build', 'migrations', 'node_modules', '__pycache__'} & set(path.parts):
        continue
    tree = ast.parse(path.read_text())
    for node in ast.walk(tree):
        if isinstance(node, ast.Call):
            name = node.func.id if isinstance(node.func, ast.Name) else ''
            for index in positions.get(name, ()):
                if len(node.args) > index:
                    collect(path, node.args[index])
            if name == 'ChoiceOption' and len(node.args) > 2 and isinstance(node.args[2], (ast.List, ast.Tuple)):
                for choice in node.args[2].elts:
                    if isinstance(choice, (ast.List, ast.Tuple)) and len(choice.elts) == 2:
                        collect(path, choice.elts[1])
            for keyword in node.keywords:
                if keyword.arg in fields and name in positions:
                    collect(path, keyword.value)
        if isinstance(node, ast.ClassDef):
            for member in node.body:
                if isinstance(member, ast.Assign) and any(isinstance(target, ast.Name) and target.id in fields for target in member.targets):
                    collect(path, member.value)
print(json.dumps(records))
`;

export function inventory(root = project) {
    const records = new Map();
    function add(file, line, value) {
        const text = value.replace(/\s+/g, " ").trim();
        if (!text) return;
        const record = {file, line, text};
        records.set(JSON.stringify(record), record);
    }
    for (const path of files(resolve(root, "src"))) {
        const file = relative(root, path);
        const emit = (line, value) => add(file, line, value);
        if (file.endsWith(".vue")) vue(readFileSync(path, "utf8"), emit);
        if (file.endsWith(".js") && /(?:viewer\/(?:src|kit)|web\/src)\//.test(file)) script(readFileSync(path, "utf8"), emit);
        if (file.endsWith(".json") && !file.endsWith("package.json") && !file.includes("lock")) {
            walk(parseExpression(readFileSync(path, "utf8")), (node) => {
                if (node.type === "ObjectProperty" && textFields.has(node.key.name ?? node.key.value)) strings(node.value, emit);
            });
        }
    }
    for (const [file, line, value] of JSON.parse(execFileSync("python3", ["-c", pythonInventory, root, [...textFields].join(",")], {encoding: "utf8", maxBuffer: 10 * 1024 * 1024}))) add(file, line, value);
    return [...records.values()].sort((a, b) => a.file.localeCompare(b.file) || a.line - b.line || a.text.localeCompare(b.text));
}

if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
    const records = inventory(process.argv[2] ? resolve(process.argv[2]) : project);
    for (const {file, line, text} of records) console.log(`${file}:${line}\t${text}`);
    console.log(`Total: ${records.length} viewer texts`);
}
