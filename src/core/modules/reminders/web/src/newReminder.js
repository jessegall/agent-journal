// the New reminder dialog: what it asks, the check before it runs and the journal line it makes. A reminder made here goes to the main agent.
const EVERY_FLAGS = {minutes: "--every-minutes", tool_uses: "--every-tool-uses", tasks: "--every-tasks"};
const SECONDS_PER_MINUTE = 60;
const isAt = (values) => values.repeat === "at";
// the time as the journal reads it; while it is still being typed the line shows an ellipsis
const iso = (text) => (Number.isNaN(Date.parse(text)) ? "…" : new Date(text).toISOString());

export const newReminderFields = [
    {key: "text", label: "Reminder", kind: "area", required: true, placeholder: "Check that the tests still pass"},
    {key: "repeat", label: "When", kind: "select", options: [["at", "At a time"], ["minutes", "Every few minutes"], ["tool_uses", "Every few tool uses"], ["tasks", "Every few closed tasks"]]},
    {key: "at", label: "At", required: true, placeholder: "2026-11-14 16:00", help: "The date and the time, as 2026-11-14 16:00", when: isAt},
    {key: "every", label: "Every", kind: "number", required: true, help: "How many minutes, tool uses or closed tasks pass between two reminders", when: (values) => !isAt(values)},
    {key: "once", label: "How often", kind: "select", options: [["no", "Keep repeating"], ["yes", "Only once"]], when: (values) => !isAt(values)},
];

export function refusedFields(values) {
    if (isAt(values)) return Number.isNaN(Date.parse(values.at)) ? {at: "Write the time like 2026-11-14 16:00"} : {};
    return Number.isInteger(Number(values.every)) && Number(values.every) >= 1 ? {} : {every: "Use a whole number of 1 or more"};
}

export function newReminderLine(values) {
    const line = ["reminder", "make", values.text.trim()];
    if (isAt(values)) return [...line, "--at", iso(values.at)];
    return [...line, EVERY_FLAGS[values.repeat], String(Number(values.every)), ...(values.once === "yes" ? ["--once"] : [])];
}

// the row the list shows while the line runs
export function newReminderPending(values) {
    const every = Number(values.every);
    return {
        id: `making-${Date.now()}`,
        text: values.text.trim(),
        created_at: new Date().toISOString(),
        due_at: isAt(values) ? iso(values.at) : null,
        interval_seconds: values.repeat === "minutes" ? every * SECONDS_PER_MINUTE : 0,
        interval_tool_uses: values.repeat === "tool_uses" ? every : 0,
        interval_tasks: values.repeat === "tasks" ? every : 0,
        single_use: values.once === "yes",
        block_condition: "",
        block_subject: "",
        last_fired_at: null,
        ended_at: null,
    };
}

// the line as it is shown under the form
export const newReminderCommand = (values) => `journal ${newReminderLine(values).map((word) => (/\s/.test(word) ? JSON.stringify(word) : word)).join(" ")}`;
