// the last compaction of a session as the context menu words it: the exact time
export function compactionLine(compaction) {
    if (!compaction) return "Not compacted yet";
    const when = new Date(compaction.started_at).toLocaleString("en-GB", {dateStyle: "medium", timeStyle: "medium"});
    return `Last compacted ${when}`;
}
