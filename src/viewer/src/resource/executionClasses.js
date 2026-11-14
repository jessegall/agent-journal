export const CLASS_LANES = ["instant", "short", "long"];
export const CLASS_PRIORITIES = ["background", "normal", "agent", "reserved", "immediate"];
export const CLASS_PRESETS = [
    {name: "small", title: "Small machine"},
    {name: "medium", title: "Medium machine"},
    {name: "large", title: "Large machine"},
];

// the options of `journal queue-class set` and `add` for a class as the table shows it
export function classOptions(entry) {
    return ["--lane", entry.lane, "--cost", String(entry.cost), "--priority", entry.priority, "--limit", String(entry.limit)];
}
