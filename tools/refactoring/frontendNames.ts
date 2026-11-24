/**
 * The names a frontend file declares at its top level, as "type<TAB>name" review lines: an exported name stands
 * alone, a name only its own file sees is written File::name, and a component is named by its file.
 */
import { basename, extname } from 'node:path';
import ts from 'typescript';

export type DeclaredName = { type: string; name: string; line: number };

const SCRIPT_BLOCK = /<script\b[^>]*>([\s\S]*?)<\/script>/g;

export function reviewLine(declared: DeclaredName): string {
    return `${declared.type}\t${declared.name}`;
}

export function frontendNamesOf(path: string, source: string): DeclaredName[] {
    const module = basename(path, extname(path));

    if (extname(path) !== '.vue') {
        return namesInScript(module, source, 0);
    }

    const names: DeclaredName[] = [{ type: 'component', name: module, line: 1 }];

    for (const block of source.matchAll(SCRIPT_BLOCK)) {
        const offset = source.slice(0, block.index).split('\n').length - 1;
        names.push(...namesInScript(module, block[1], offset));
    }

    return names;
}

function namesInScript(module: string, script: string, lineOffset: number): DeclaredName[] {
    const file = ts.createSourceFile('script.ts', script, ts.ScriptTarget.Latest, true);
    const names: DeclaredName[] = [];
    const add = (type: string, node: ts.Node, name: string, exported: boolean) => {
        const line = file.getLineAndCharacterOfPosition(node.getStart(file)).line + 1 + lineOffset;
        names.push({ type, name: exported ? name : `${module}::${name}`, line });
    };

    for (const statement of file.statements) {
        const exported = isExported(statement);

        if (ts.isFunctionDeclaration(statement) && statement.name) {
            add('function', statement, statement.name.text, exported);
        } else if (ts.isClassDeclaration(statement) && statement.name) {
            add('class', statement, statement.name.text, exported);
        } else if (ts.isInterfaceDeclaration(statement) || ts.isTypeAliasDeclaration(statement)) {
            add('type', statement, statement.name.text, exported);
        } else if (ts.isEnumDeclaration(statement)) {
            add('enum', statement, statement.name.text, exported);
        } else if (ts.isVariableStatement(statement)) {
            for (const declaration of statement.declarationList.declarations) {
                for (const name of boundNames(declaration.name)) {
                    add('variable', declaration, name, exported);
                }
            }
        }
    }

    return names;
}

function isExported(statement: ts.Statement): boolean {
    return (ts.canHaveModifiers(statement) ? ts.getModifiers(statement) ?? [] : []).some(
        (modifier) => modifier.kind === ts.SyntaxKind.ExportKeyword,
    );
}

function boundNames(name: ts.BindingName): string[] {
    if (ts.isIdentifier(name)) {
        return [name.text];
    }

    return name.elements.flatMap((element) =>
        ts.isOmittedExpression(element) ? [] : boundNames(element.name),
    );
}
