/**
 * The place a text comment points at, as the comment form sends it: a section, a span of lines, or an exact quote with
 * zero-based UTF-8 byte offsets within its lines, always with the version it was chosen in.
 */
export type TextRangeChoice =
    | { type: 'section'; version: string; section: number }
    | { type: 'lines'; version: string; firstLine: number; lastLine: number }
    | { type: 'quote'; version: string; firstLine: number; lastLine: number; quote: string; startOffset: number; endOffset: number };

/**
 * What a comment is about: the whole record, or one chosen place in its text.
 */
export type CommentSubject = { type: 'record' } | { type: 'text'; range: TextRangeChoice };

const encoder = new TextEncoder();

/**
 * The exact quote between two character positions of a line window, with its byte offsets counted from the start of
 * the window's first line, so two identical phrases stay apart by where they are.
 */
export function quoteIn(lines: string[], firstLine: number, start: { line: number; character: number }, end: { line: number; character: number }, version: string): TextRangeChoice {
    const fromLine = lines[start.line - firstLine];
    const window = lines.slice(start.line - firstLine, end.line - firstLine + 1).join('\n');
    const startCharacter = start.character;
    const endCharacter = window.length - (lines[end.line - firstLine].length - end.character);
    const quote = window.slice(startCharacter, endCharacter);
    const startOffset = encoder.encode(fromLine.slice(0, startCharacter)).length;

    return { type: 'quote', version, firstLine: start.line, lastLine: end.line, quote, startOffset, endOffset: startOffset + encoder.encode(quote).length };
}

/**
 * The fields the comment form posts for a text place: its version, and the section, the lines or the exact quote.
 */
export type SubjectFields =
    | Record<string, never>
    | { version: string; section: number }
    | { version: string; first_line: number; last_line: number }
    | { version: string; first_line: number; last_line: number; quote: string; start_offset: number; end_offset: number };

/**
 * The fields the comment form posts for a subject: none for the whole record, the place's own fields for text.
 */
export function subjectFields(subject: CommentSubject): SubjectFields {
    if (subject.type === 'record') {
        return {};
    }

    const range = subject.range;

    switch (range.type) {
        case 'section':
            return { version: range.version, section: range.section };
        case 'lines':
            return { version: range.version, first_line: range.firstLine, last_line: range.lastLine };
        case 'quote':
            return { version: range.version, first_line: range.firstLine, last_line: range.lastLine, quote: range.quote, start_offset: range.startOffset, end_offset: range.endOffset };
    }
}

/**
 * The place in words, for the form and for screen readers.
 */
export function describeRange(range: TextRangeChoice): string {
    switch (range.type) {
        case 'section':
            return `Section ${range.section} of version ${range.version}`;
        case 'lines':
            return `Lines ${range.firstLine}–${range.lastLine} of version ${range.version}`;
        case 'quote':
            return `“${range.quote}” on lines ${range.firstLine}–${range.lastLine} of version ${range.version}`;
    }
}
