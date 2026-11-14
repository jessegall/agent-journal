// the dialogs of the Templates page: what each asks, its check and the journal line it runs
export const KIND_WORDS = {plan: "Plan", task: "Task", doc: "Document"};
const APPLIES = [["plan", "Plans"], ["task", "Tasks"], ["doc", "Documents"], ["plan,task", "Plans and tasks"]];
const quoted = (word) => (/\s/.test(word) ? JSON.stringify(word) : word);
const shown = (words) => `journal ${words.map(quoted).join(" ")}`;
const filled = (list) => list.map((text) => text.trim()).filter(Boolean);

// a template made here can be edited; one a module published is written again at each start, so it cannot
export const isOwn = (template) => !template.module;

// the names in braces in its parts are the slots a row fills when the template is sent
export const slotsOf = (template) => [...new Set(template.parts.flatMap((part) => [...part.matchAll(/\{(\w+)\}/g)].map((found) => found[1])))];

// a part is written "Heading: what it says"
export function partWords(part) {
    const at = part.indexOf(":");
    return at < 0 ? {heading: part, body: ""} : {heading: part.slice(0, at).trim(), body: part.slice(at + 1).trim()};
}

// the New and Edit dialogs
export function templateFields(template = null) {
    const applies = template?.targets.join(",") || "plan";
    return [
        {key: "title", label: "Title", required: true, placeholder: "Plan: release", value: template?.title ?? ""},
        {key: "brief", label: "Description", required: true, value: template?.brief ?? ""},
        {key: "applies", label: "Applies to", kind: "select", options: APPLIES.some(([value]) => value === applies) ? APPLIES : [...APPLIES, [applies, applies]], value: applies},
        {key: "purpose", label: "Purpose", value: template?.purpose ?? ""},
        {key: "parts", label: "Parts", kind: "slot", required: true, value: template ? [...template.parts] : [""]},
        {key: "commands", label: "Phase end commands", kind: "slot", help: "Run at each phase end of a plan", value: template ? [...template.commands] : [], when: (values) => values.applies.startsWith("plan")},
    ];
}
export const checkTemplate = (values) => (filled(values.parts).some((part) => part.includes("|")) ? {parts: "A part cannot hold the | sign."} : {});
const withCommands = (values) => values.applies.startsWith("plan") && filled(values.commands).length > 0;
// make takes a list as one text split at |, edit takes it as words
export const newTemplateLine = (values) => ["template", "make", values.title.trim(), "--applies-to", values.applies, "--brief", values.brief.trim(), "--purpose", values.purpose.trim(), "--parts", filled(values.parts).join(" | "), ...(withCommands(values) ? ["--commands", filled(values.commands).join(" | ")] : [])];
export const newTemplateCommand = (values) => shown(["template", "make", values.title.trim() || "…", "--applies-to", values.applies, "--brief", "…", "--parts", "…"]);
export const editTemplateLine = (template, values) => ["template", "edit", String(template.id), "--title", values.title.trim(), "--brief", values.brief.trim(), "--targets", ...values.applies.split(","), "--purpose", values.purpose.trim(), "--parts", ...filled(values.parts), ...(withCommands(values) ? ["--commands", ...filled(values.commands)] : [])];
export const editTemplateCommand = (template) => () => shown(["template", "edit", String(template.id), "…"]);

// Send it on a row: the kind of row, its number and a value for each slot
export const sendFields = (template) => [
    {key: "kind", label: "On", kind: "select", options: (template.targets.length ? template.targets : Object.keys(KIND_WORDS)).map((kind) => [kind, KIND_WORDS[kind] ?? kind]), required: true},
    {key: "row", label: "Number", required: true, placeholder: "1131"},
    ...slotsOf(template).map((name) => ({key: `slot-${name}`, label: `{${name}}`, required: true})),
];
export const checkSend = (values) => (/^\d+$/.test(values.row.trim()) ? {} : {row: "Write the number of the row."});
export const sendLine = (template, values) => ["template", "send", String(template.id), `--on=${values.kind}:${values.row.trim()}`, ...slotsOf(template).map((name) => `--set=${name}=${values[`slot-${name}`]}`)];
export const sendCommand = (template) => (values) => shown(["template", "send", String(template.id), `--on=${values.kind}:${values.row.trim() || "…"}`, ...slotsOf(template).map((name) => `--set=${name}=…`)]);
