// the New check dialog: what it asks, its check and the journal line it runs as journal check make
const quoted = (word) => (/\s/.test(word) ? JSON.stringify(word) : word);

export const newCheckFields = [
    {key: "title", label: "Title", required: true, placeholder: "Unit tests"},
    {key: "command", label: "Command", required: true, placeholder: "pytest tests/unit"},
    {key: "every", label: "Run every, in minutes", kind: "number", help: "Leave blank to run it only by hand.", placeholder: "30"},
];
export const checkNewCheck = (values) => (Number(values.every || 0) < 0 ? {every: "Use a number of minutes, or leave it blank."} : {});
const wordsOf = (values) => ["check", "make", values.title.trim() || "…", "--command", values.command.trim() || "…", ...(Number(values.every) > 0 ? ["--every", String(Number(values.every))] : [])];
export const newCheckLine = (values) => wordsOf(values);
export const newCheckCommand = (values) => `journal ${wordsOf(values).map(quoted).join(" ")}`;
