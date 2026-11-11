// the last compaction of a session as the context menu words it: the exact time
export function compactionLine(compaction) {
    if (!compaction) return "Not compacted yet";
    const when = new Date(compaction.started_at).toLocaleString("en-GB", {dateStyle: "medium", timeStyle: "medium"});
    return `Last compacted ${when}`;
}

const CHANGE_WORDS = {compact: "Compaction", clear: "Clear"};
const REASON_WORDS = {stop_limit: "The journal, at the context size", hard_stop: "The journal, at the second context size", person: "A person, in the viewer", auto: "The program", terminal_person: "A person, in the terminal", headless_program: "The journal, before the next job"};
const STATE_WORDS = {requested: "Asked, not started yet", started: "Running", ended: "Ended, size not read yet", measured: "Done", unreduced: "Done, context not smaller", failed: "Failed", abandoned: "Given up"};

// the words of the request for a compaction or clear that is still open, or nothing when none is
export function openContextChangeLine(change) {
    if (!change?.is_open) return "";
    return `${CHANGE_WORDS[change.change]} asked at ${new Date(change.requested_at).toLocaleTimeString([], {hour: "2-digit", minute: "2-digit"})}`;
}

// the rows the agent inspector shows about the newest compaction or clear of an agent
export function contextChangeRows(change) {
    if (!change) return [];
    const rows = [["Last context change", `${CHANGE_WORDS[change.change]}: ${STATE_WORDS[change.state]}`], ["Asked by", REASON_WORDS[change.reason]], ["Asked", new Date(change.requested_at).toLocaleString()]];
    if (change.request_tokens != null) rows.push(["Size at the request", `${change.request_tokens} tokens`]);
    if (change.tokens_after != null) rows.push(["Size after", `${change.tokens_after} tokens`]);
    return rows;
}
