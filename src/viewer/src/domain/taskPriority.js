// How urgent a task is: a number with named levels, normal the default; a number that is a level reads by its name.
export const PRIORITY_LEVELS = [
    {key: 100, label: "Low"},
    {key: 200, label: "Normal"},
    {key: 300, label: "High"},
    {key: 400, label: "Critical"},
];
export const NORMAL_PRIORITY = 200;

// The named level a number shows as: the highest level at or below it, Low when it is under them all.
export const namedPriority = (priority) => PRIORITY_LEVELS.findLast((level) => level.key <= priority)?.key ?? PRIORITY_LEVELS[0].key;

export const priorityLabel = (priority) => PRIORITY_LEVELS.find((level) => level.key === priority)?.label || String(priority);
