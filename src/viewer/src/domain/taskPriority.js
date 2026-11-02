// How urgent a task is: a number with named levels, normal the default; a number that is a level reads by its name.
export const PRIORITY_LEVELS = [
    {key: 100, label: "Low"},
    {key: 200, label: "Normal"},
    {key: 300, label: "High"},
    {key: 400, label: "Critical"},
];
export const NORMAL_PRIORITY = 200;

export const priorityLabel = (priority) => PRIORITY_LEVELS.find((level) => level.key === priority)?.label || String(priority);
