/**
 * The wait link a task reader followed to another task, by the task it was followed from. It is kept outside the
 * reader, which a visit draws anew, so going back to that task gives the link the focus again.
 */
const followedLinks = new Map<string, string>();

export function rememberFollowedWait(fromTask: string, toTask: string): void {
    followedLinks.set(fromTask, toTask);
}

/**
 * The task whose link was followed from this task, given once.
 */
export function takeFollowedWait(fromTask: string): string | undefined {
    const toTask = followedLinks.get(fromTask);
    followedLinks.delete(fromTask);

    return toTask;
}
