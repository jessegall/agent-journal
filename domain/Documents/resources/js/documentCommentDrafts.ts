import { reactive } from 'vue';

/**
 * A comment being written on some lines of a revision, with the key its send carries so a retry is the same send.
 */
export type LineDraft = { text: string; key: string };

const drafts = reactive(new Map<string, LineDraft>());

/**
 * The draft for these lines of this revision of a record, made the first time it is asked for. It is kept outside the
 * component, so leaving the text and coming back finds it, and each revision and range has its own.
 */
export function draftFor(target: string, revision: string, from: number, to: number): LineDraft {
    const id = `${target}\u0000${revision}\u0000${from}-${to}`;
    const existing = drafts.get(id);

    if (existing !== undefined) {
        return existing;
    }

    const made = reactive<LineDraft>({ text: '', key: crypto.randomUUID() });
    drafts.set(id, made);

    return made;
}

/**
 * Forgets the draft of these lines once its comment was accepted.
 */
export function forgetDraft(target: string, revision: string, from: number, to: number): void {
    drafts.delete(`${target}\u0000${revision}\u0000${from}-${to}`);
}
