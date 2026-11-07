// the last compaction of a session as the context menu words it: the exact time, and how much it took off when both percents are known
export function compactionLine(compaction) {
    if (!compaction) return "Not compacted yet";
    const when = new Date(compaction.started_at).toLocaleString("en-GB", {dateStyle: "medium", timeStyle: "medium"});
    if (compaction.start_percent === null) return `Last compacted ${when}`;
    if (compaction.end_percent === null) return `Last compacted ${when}, from ${compaction.start_percent}%`;
    return `Last compacted ${when}, from ${compaction.start_percent}% to ${compaction.end_percent}%, ${compaction.start_percent - compaction.end_percent}% taken off`;
}
