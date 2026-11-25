import { router } from '@inertiajs/vue3';
import { reactive } from 'vue';

/**
 * A comment being written on some lines of a revision, with the key its send carries so a retry is the same send.
 */
export type LineDraft = { text: string; key: string };

const drafts = reactive(new Map<string, LineDraft>());

/**
 * The draft for these lines of this version of a record, made the first time it is asked for. It is kept outside the
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

/**
 * Sends the draft as a comment on these lines of one version of a record to the address that saves comments, under
 * the draft's key, so a retry is the same send. The draft is forgotten once the comment is accepted; a failed send keeps it.
 */
export function sendLineComment(
    address: string,
    target: string,
    version: string,
    from: number,
    to: number,
    // only names the props the answer reloads: the comment's own window, so the others keep what they show.
    outcome: { only: string[]; onSent: () => void; onFailed: () => void },
): void {
    const draft = draftFor(target, version, from, to);

    if (draft.text.trim() === '') {
        return;
    }

    const failed = (): false => {
        outcome.onFailed();

        return false;
    };

    router.post(
        address,
        {
            target,
            body: draft.text,
            submission_key: draft.key,
            version,
            first_line: from,
            last_line: to,
        },
        {
            only: outcome.only,
            preserveState: true,
            preserveScroll: true,
            onSuccess: () => {
                forgetDraft(target, version, from, to);
                outcome.onSent();
            },
            onError: () => outcome.onFailed(),
            onNetworkError: failed,
            onHttpException: failed,
        },
    );
}
