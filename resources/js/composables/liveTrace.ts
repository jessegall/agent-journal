/**
 * The milestones of the tab's live connection and of the page reads it starts, kept in memory so an operator can
 * see in the browser console which stage of a delivery was missed. It holds no message text and no record ids.
 */
export type LiveTraceStep =
    | 'transport connected'
    | 'transport lost'
    | 'subscription authorized'
    | 'subscription refused'
    | 'foreign channel refused'
    | 'signal received'
    | 'chat access ended'
    | 'read started'
    | 'read applied'
    | 'read failed';

export type LiveTraceEntry = { at: string; step: LiveTraceStep };

const TRACE_LENGTH = 50;

const entries: LiveTraceEntry[] = [];

/**
 * Notes one milestone with its time, keeping only the last fifty.
 */
export function traceLive(step: LiveTraceStep): void {
    entries.push({ at: new Date().toISOString(), step });

    if (entries.length > TRACE_LENGTH) {
        entries.splice(0, entries.length - TRACE_LENGTH);
    }
}

/**
 * The milestones noted so far, oldest first.
 */
export function liveTrace(): LiveTraceEntry[] {
    return [...entries];
}
