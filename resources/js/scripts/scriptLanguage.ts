import type { CompletionContext, CompletionResult } from '@codemirror/autocomplete';
import type { Diagnostic } from '@codemirror/lint';
import { StreamLanguage, type StreamParser } from '@codemirror/language';
import type { Text } from '@codemirror/state';

/**
 * The editor's view of the script language, built from what the journal says it is: its keyword tokens, its objects
 * with their boolean members, and the draft's command keys. No keyword or object is written here.
 */
export type ScriptVocabulary = {
    keywords: string[];
    members: Record<string, string[]>;
    commands: string[];
};

export type ScriptDiagnosticRange = {
    code: string;
    message: string;
    line: number;
    column: number;
    length: number;
};

/**
 * Highlights the keywords, object members, strings and comments of a script.
 */
export function scriptHighlighting(vocabulary: ScriptVocabulary): StreamLanguage<unknown> {
    const keywords = new Set(vocabulary.keywords);
    const parser: StreamParser<unknown> = {
        token(stream) {
            if (stream.eatSpace()) {
                return null;
            }

            if (stream.match('#')) {
                stream.skipToEnd();

                return 'comment';
            }

            if (stream.match(/^"(?:[^"\\]|\\.)*"?/)) {
                return 'string';
            }

            const word = stream.match(/^[A-Za-z_][A-Za-z0-9_.-]*/);

            if (typeof word !== 'object' || word === null) {
                stream.next();

                return null;
            }

            const text = word[0];

            if (keywords.has(text)) {
                return 'keyword';
            }

            return text.includes('.') ? 'propertyName' : 'variableName';
        },
    };

    return StreamLanguage.define(parser);
}

/**
 * Completes keywords at the start of a statement, object.member after an object's name and a dot, and command keys
 * after RUN.
 */
export function scriptCompletion(vocabulary: ScriptVocabulary) {
    return (context: CompletionContext): CompletionResult | null => {
        const member = context.matchBefore(/[A-Za-z_][A-Za-z0-9_]*\.[A-Za-z0-9_]*/);

        if (member !== null) {
            const [object] = member.text.split('.');
            const members = vocabulary.members[object] ?? [];

            return {
                from: member.from + object.length + 1,
                options: members.map((name) => ({ label: name, type: 'property' })),
            };
        }

        const word = context.matchBefore(/[A-Za-z_][A-Za-z0-9_-]*/);

        if (word === null && !context.explicit) {
            return null;
        }

        const line = context.state.doc.lineAt(context.pos);
        const before = line.text.slice(0, context.pos - line.from).trimStart();
        const afterRun = /^RUN\s+\S*$/.test(before);
        const options = afterRun
            ? vocabulary.commands.map((name) => ({ label: name, type: 'function' }))
            : [
                  ...vocabulary.keywords.map((name) => ({ label: name, type: 'keyword' })),
                  ...Object.keys(vocabulary.members).map((name) => ({ label: name, type: 'variable' })),
              ];

        return { from: word?.from ?? context.pos, options };
    };
}

/**
 * Turns the journal's diagnostics, which count lines and columns from 1 in code points, into editor ranges.
 */
export function editorDiagnostics(document: Text, diagnostics: ScriptDiagnosticRange[]): Diagnostic[] {
    return diagnostics
        .filter((diagnostic) => diagnostic.line >= 1 && diagnostic.line <= document.lines)
        .map((diagnostic): Diagnostic => {
            const line = document.line(diagnostic.line);
            const characters = Array.from(line.text);
            const startUnits = characters.slice(0, Math.max(diagnostic.column - 1, 0)).join('').length;
            const lengthUnits = characters
                .slice(Math.max(diagnostic.column - 1, 0), diagnostic.column - 1 + Math.max(diagnostic.length, 1))
                .join('').length;
            const from = Math.min(line.from + startUnits, line.to);

            return {
                from,
                to: Math.min(from + Math.max(lengthUnits, 1), line.to),
                severity: 'error',
                message: `${diagnostic.code}: ${diagnostic.message}`,
            };
        });
}
