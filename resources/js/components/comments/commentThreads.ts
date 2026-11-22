import { reactive } from 'vue';

/**
 * The exact comment request that got no answer, kept as it was sent so a check replays it under the same key.
 */
export type CommentAttempt = {
    fields: Record<string, unknown>;
    key: string;
};

/**
 * One pane's thread of one record: the draft being written with the key its next post will carry, the attempt whose
 * answer was lost, whether that attempt was checked, and a generation that a refused read moves on, so an answer to
 * an earlier generation is dropped.
 */
export type CommentThread = {
    draft: { body: string; key: string };
    attempt: CommentAttempt | null;
    isChecked: boolean;
    generation: number;
};

const threads = new Map<string, CommentThread>();

/**
 * The thread of a record in a pane, kept outside the components so it lasts while a tab or the pane's window is drawn
 * anew; the same record in two panes has two threads.
 */
export function commentThreadOf(pane: string, record: string): CommentThread {
    const key = `${pane}\u0000${record}`;
    const existing = threads.get(key);

    if (existing !== undefined) {
        return existing;
    }

    const thread = reactive<CommentThread>({
        draft: { body: '', key: crypto.randomUUID() },
        attempt: null,
        isChecked: false,
        generation: 0,
    });
    threads.set(key, thread);

    return thread;
}

/**
 * Forgets what a refused reader held: the draft, its key and the lost attempt; the next answer of the old generation
 * is dropped.
 */
export function clearCommentThread(thread: CommentThread): void {
    thread.draft = { body: '', key: crypto.randomUUID() };
    thread.attempt = null;
    thread.isChecked = false;
    thread.generation++;
}
