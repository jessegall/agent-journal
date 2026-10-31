// How urgent a task is: a number with named levels, normal the default; a number that is a level reads by its name.
export const PRIORITY_LEVELS = [
    {key: 50, label: "Low"},
    {key: 100, label: "Normal"},
    {key: 150, label: "High"},
    {key: 200, label: "Critical"},
];
export const NORMAL_PRIORITY = 100;

export const priorityLabel = (priority) => PRIORITY_LEVELS.find((level) => level.key === priority)?.label || String(priority);
