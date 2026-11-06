// the last compaction of a session as the context menu words it: the exact time, and how much it took off when both percents are known
export function compactionLine(compaction) {
    if (!compaction) return "Not compacted yet";
    const when = new Date(compaction.at).toLocaleString("en-GB", {dateStyle: "medium", timeStyle: "medium"});
    if (compaction.from_percent === null) return `Last compacted ${when}`;
    if (compaction.to_percent === null) return `Last compacted ${when}, from ${compaction.from_percent}%`;
    return `Last compacted ${when}, from ${compaction.from_percent}% to ${compaction.to_percent}%, ${compaction.from_percent - compaction.to_percent}% taken off`;
}
