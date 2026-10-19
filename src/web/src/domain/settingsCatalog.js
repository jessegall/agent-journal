

export const COUNTED = ["percent", "uses", "minutes"];
export const EVENTS = ["idle", "worked", "start"];

const UNIT_WORDS = {percent: "% of context", uses: "tool calls", minutes: "minutes", notices: "reminders"};
const EVENT_WORDS = {idle: "when the agent stops", worked: "when the agent stops after using tools", start: "when a session starts"};
const HOURS = {60: "every hour", 1440: "every day"};
const OFF_LINE = "Off. Turn it on to change these.";

export const UNIT_CHOICES = {percent: "% of context", uses: "tool calls", minutes: "minutes", notices: "reminders"};
export const EVENT_CHOICES = {idle: "the agent stops", worked: "it stops after using tools", start: "a session starts"};

const sorted = (value) =>
    value && typeof value === "object" && !Array.isArray(value)
        ? Object.fromEntries(
              Object.keys(value)
                  .sort()
                  .map((key) => [key, sorted(value[key])])
          )
        : value;

export const same = (a, b) => JSON.stringify(sorted(a)) === JSON.stringify(sorted(b));

// an option's words, with the workflow node that reads it, or the plain fact that none does
function readBy(setting) {
    const workflows = [...new Set((setting.read_by || []).map((r) => r.workflow))];
    if (!workflows.length) return `${setting.abstract}.`;
    return `${setting.abstract}. Read by the workflow ${workflows.join(", ")}.`;
}

const hasTiming = (when) => Boolean(when && (when.unit || when.on));

export function timingWords(when) {
    if (!hasTiming(when)) return "";
    if (when.on) return EVENT_WORDS[when.on] || when.on;
    if (when.at) return `at ${when.at.join(", ")}${UNIT_WORDS.percent}`;
    if (when.unit === "percent") return `every ${when.every}${UNIT_WORDS.percent}`;
    if (when.unit === "minutes" && HOURS[when.every]) return HOURS[when.every];
    if (when.unit === "minutes" && when.every > 60 && when.every % 60 === 0) return `every ${when.every / 60} hours`;
    const unit = UNIT_WORDS[when.unit] || when.unit;
    return when.every === 1 ? `every ${unit.replace(/s$/, "")}` : `every ${when.every} ${unit}`;
}

export function timingEvery(when, value) {
    const every = Number(value);
    if (!(every > 0)) return null;
    return {every, unit: when.at || !when.unit ? "percent" : when.unit};
}

export function timingUnit(when, unit) {
    if (EVENTS.includes(unit)) return {on: unit};
    return {every: when.every || (unit === "minutes" ? 5 : 10), unit};
}

export function timingMarks(value) {
    const at = String(value)
        .split(/[\s,%]+/)
        .map(Number)
        .filter((n) => n > 0 && n <= 100);
    return at.length ? {unit: "percent", at} : null;
}

export function settingChanges(target, value, settings) {
    const [top, key] = target.path;
    const saved = settings[top] || {};
    const base = target.defaults
        ? Object.fromEntries(
              Object.keys(target.defaults)
                  .filter((k) => k in saved && !same(saved[k], target.defaults[k]))
                  .map((k) => [k, saved[k]])
          )
        : {...saved};
    const stored = target.provider ? {...target.saved, [target.provider]: value} : target.invert ? !value : value;
    if (target.sparse && same(stored, target.shipped)) delete base[key];
    else base[key] = stored;
    return {[top]: base};
}

const capital = (text) => text.charAt(0).toUpperCase() + text.slice(1);

const choiceOptions = (setting) => setting.choices.map((key) => ({key, label: (setting.labels || {})[key] || capital(key)}));

function row(fields) {
    const complete = {indent: false, hint: "", words: "", example: "", prefix: "", ...fields};
    const changed = fields.changed ?? (fields.shipped !== undefined && !same(fields.value, fields.shipped));
    const timed = Boolean(complete.timing && complete.timing.changed);
    return {
        ...complete,
        changed: changed || timed,
        off: complete.kind === "switch" && !complete.value,
        words: `${complete.label} ${complete.hint} ${complete.words}`.toLowerCase(),
    };
}

function timing(name, declared, settings) {
    if (!hasTiming(declared)) return null;
    const value = (settings.triggers || {})[name] || declared;
    return {
        value,
        shipped: declared,
        words: timingWords(value),
        changed: !same(value, declared),
        target: {path: ["triggers", name], sparse: true, shipped: declared},
    };
}

const switchValue = (settings, name, fallback) => {
    const saved = settings.features || {};
    return name in saved ? Boolean(saved[name]) : fallback;
};

// What a switch governs, said the way the user reads it: the sentence of each nudge it turns off, or the behaviour's own words when it sends none.
const whatItSends = (f, key) =>
    Object.values(f.nudges || {})
        .filter((n) => n.behaviour === key && n.guarantee)
        .map((n) => n.guarantee)
        .join(" ");

function behaviourRow(f, key, b, settings) {
    const name = `${f.name}.${key}`;
    return row({
        key: name,
        kind: "switch",
        label: b.title,
        hint: whatItSends(f, key) || b.abstract,
        value: switchValue(settings, name, b.default),
        shipped: b.default,
        timing: timing(name, b.trigger, settings),
        prefix: b.prefix,
        target: {path: ["features", name]},
    });
}

// A sentence of the user's own, added to the end of one nudge. The journal's own words stay as they are; this is said after them.
function nudgeRow(f, line, nudge, settings) {
    const name = `${f.name}.${line}`;
    return row({
        key: `said:${name}`,
        kind: "text",
        indent: true,
        label: nudge.guarantee || line,
        hint: "Said to the agent after this nudge, in your own words",
        value: (settings.said || {})[name] ?? "",
        shipped: "",
        target: {path: ["said", name], sparse: true, shipped: ""},
    });
}

function nudgeRowsOf(f, key, settings) {
    return Object.entries(f.nudges || {})
        .filter(([, nudge]) => nudge.behaviour === key)
        .map(([line, nudge]) => nudgeRow(f, line, nudge, settings));
}

function settingRow(f, setting, settings) {
    const saved = (settings[f.name] || {})[setting.name] ?? setting.default;
    const value = setting.kind !== "choice" || setting.choices.includes(saved) ? saved : setting.default;
    const defaults = Object.fromEntries(f.settings.map((s) => [s.name, s.default]));
    return row({
        key: `${f.name}:${setting.name}`,
        kind: setting.kind,
        label: setting.title,
        hint: readBy(setting),
        unit: setting.unit,
        provider: setting.provider,
        indent: Boolean(setting.under),
        options: setting.kind === "choice" ? choiceOptions(setting) : [],
        example: (setting.examples || {})[value] || "",
        value,
        shipped: setting.default,
        target: {path: [f.name, setting.name], sparse: true, shipped: setting.default, defaults},
    });
}

const settingRows = (f, setting, settings) => [settingRow(f, setting, settings)];

function featureRows(f, settings, extras) {
    const declared = f.settings.filter((s) => s.kind !== "map" && !s.hidden);
    const under = (key) => declared.filter((s) => s.under === key).flatMap((s) => settingRows(f, s, settings));
    const own =
        hasTiming(f.trigger) && f.trigger_label
            ? [row({key: `${f.name}:timing`, kind: "timing", label: f.trigger_label, timing: timing(f.name, f.trigger, settings)})]
            : [];
    return [
        ...own,
        ...Object.entries(f.behaviours).flatMap(([key, b]) => [
            behaviourRow(f, key, b, settings),
            ...nudgeRowsOf(f, key, settings),
            ...under(key),
        ]),
        ...declared.filter((s) => !s.under).flatMap((s) => settingRows(f, s, settings)),
        ...(extras[f.name] || []),
    ];
}

function featureHead(f, label, hint, settings) {
    const shared = {
        key: f.name,
        label,
        hint,
        explains: f.explains,
        promises: f.promises || [],
        words: `${f.title} ${(f.keywords || []).join(" ")}`,
        timing: f.trigger_label ? null : timing(f.name, f.trigger, settings),
    };
    if (f.fixed) return row({...shared, kind: "always"});
    const value = switchValue(settings, f.name, f.default);
    return row({...shared, kind: "switch", value, shipped: f.default, target: {path: ["features", f.name]}});
}

const plain = (f, extras) => !f.fixed && !f.parts && !hasTiming(f.trigger) && !(extras[f.name] || []).length;

function block(f, settings, extras) {
    return {
        key: f.name,
        block: true,
        explains: f.explains,
        promises: f.promises || [],
        head: featureHead(f, f.label, f.hint, settings),
        rows: featureRows(f, settings, extras),
    };
}

// A feature of the manifest as the catalogue reads one: its options as settings, in the group it leads.
function normalised(f) {
    return {...f, label: f.title, hint: f.help, settings: f.options, behaviours: {}, nudges: {}, group: f.name, parts: f.options.length};
}

function group(g, members, settings, loose) {
    const lead = members.find((f) => f.name === g.lead);
    const rest = members
        .filter((f) => f !== lead)
        .sort((a, b) => (a.position ?? 100) - (b.position ?? 100) || a.label.localeCompare(b.label));
    const extras = loose.extras;
    const always = rest.filter((f) => f.fixed && !f.parts);
    const flat = rest.filter((f) => !always.includes(f) && plain(f, extras));
    const blocks = rest.filter((f) => !always.includes(f) && !flat.includes(f));
    const head = lead ? featureHead(lead, g.title, g.line, settings) : null;
    return {
        key: g.key,
        title: g.title,
        line: head && head.off ? OFF_LINE : g.line,
        section: g.section,
        tab: g.tab,
        explains: lead ? lead.explains : "",
        promises: lead ? lead.promises || [] : [],
        head,
        items: [
            ...(lead ? featureRows(lead, settings, extras) : []),
            ...(loose.rows[g.key] || []),
            ...rest
                .filter((f) => flat.includes(f) || blocks.includes(f))
                .map((f) => (flat.includes(f) ? featureHead(f, f.label, f.hint, settings) : block(f, settings, extras))),
        ],
        always: always.map((f) => ({key: f.name, label: f.label, explains: f.explains, promises: f.promises || []})),
        danger: loose.danger[g.key] || [],
    };
}

function looseRows(settings) {
    const viewer = settings.viewer || {};
    return {
        rows: {
            project: [
                row({
                    key: "away",
                    kind: "switch",
                    label: "Show what happened while you were away",
                    hint: "A summary card when you come back to this tab",
                    value: viewer.away !== false,
                    shipped: true,
                    target: {path: ["viewer", "away"]},
                }),
                row({
                    key: "flash",
                    kind: "switch",
                    label: "Show the journal's name when you come back",
                    hint: "Its name and colour fill the window briefly, so you can tell which journal this is",
                    value: viewer.flash !== false,
                    shipped: true,
                    target: {path: ["viewer", "flash"]},
                }),
            ],
        },
        extras: {},
        danger: {},
    };
}

// The settings page's sections from the manifest's features and groups and the saved settings.
export function catalog(spec, settings) {
    const features = (spec.features || []).map(normalised);
    const loose = looseRows(settings || {});
    const groups = (spec.groups || []).map((g) =>
        group(
            g,
            features.filter((f) => f.group === g.key),
            settings || {},
            loose
        )
    );
    const titles = [...new Set((spec.groups || []).map((g) => g.section))];
    return titles.map((title) => ({title, groups: groups.filter((g) => g.section === title)}));
}

const rowsOf = (item) => (item.block ? [item.head, ...item.rows] : [item]);

export const groupRows = (g) => [...(g.head ? [g.head] : []), ...g.items.flatMap(rowsOf), ...g.danger];

export const counted = (g) => g.items.reduce((n, item) => n + rowsOf(item).length, 0) + g.danger.length;

export function counts(sections) {
    const rows = sections.flatMap((s) => s.groups.flatMap(groupRows));
    return {changed: rows.filter((r) => r.changed).length, off: rows.filter((r) => r.off).length};
}

export const matches = (text, query) =>
    query
        .toLowerCase()
        .split(/\s+/)
        .filter(Boolean)
        .every((word) => text.toLowerCase().includes(word));

function pruned(g, test, whole) {
    if (whole(g)) return g;
    const items = g.items.flatMap((item) => {
        if (!item.block) return test(item) ? [item] : [];
        if (test(item.head)) return [item];
        const rows = item.rows.filter(test);
        return rows.length ? [{...item, rows}] : [];
    });
    const danger = g.danger.filter(test);
    return items.length || danger.length ? {...g, items, danger, always: []} : null;
}

const FILTERS = {all: () => true, changed: (r) => r.changed, off: (r) => r.off};

export function narrowed(sections, query, filter) {
    const asked = FILTERS[filter] || FILTERS.all;
    const words = query.trim();
    const test = (r) => asked(r) && (!words || matches(r.words, words));
    const whole = (g) => (!words || matches(`${g.title} ${g.line}`, words)) && (filter === "all" || Boolean(g.head && asked(g.head)));
    return sections
        .map((s) => ({...s, groups: s.groups.map((g) => pruned(g, test, whole)).filter(Boolean)}))
        .filter((s) => s.groups.length);
}

export const TABS = [
    {
        key: "agent",
        title: "Agent",
        line: "How the agent works, talks to you and keeps track of its work. Each of these can be switched off on its own.",
    },
    {
        key: "features",
        title: "Features",
        line: "What the journal does besides the agent's own settings, which are in the Agent tab. Each feature can be switched off on its own.",
    },
    {key: "system", title: "System", line: "Project settings and what the browser shows."},
    {key: "sharing", title: "Share links", line: "Share links reach this journal through the tunler account below."},
    {key: "plugins", title: "Plugins", line: "The settings of each installed plugin."},
    {key: "environments", title: "Environments", line: "The environments of this project. Each has its own to-dos, agent and history."},
];

export const tabLine = (key) => TABS.find((t) => t.key === key).line;

export const untitled = (group) => !group.items.length && group.danger.length > 0;

export function inTab(sections, tab) {
    return sections.map((s) => ({...s, groups: s.groups.filter((g) => g.tab === tab)})).filter((s) => s.groups.length);
}

export function tabCounts(sections) {
    const found = Object.fromEntries(TABS.map((t) => [t.key, 0]));
    sections.forEach((s) => s.groups.forEach((g) => (found[g.tab] += counted(g))));
    return found;
}

export function navGroups(groups) {
    const folded = new Set();
    return groups.flatMap((g) => {
        const [head, rest] = g.title.split("/");
        if (!rest) return [g];
        if (folded.has(head)) return [];
        folded.add(head);
        return [{...g, title: head.charAt(0).toUpperCase() + head.slice(1)}];
    });
}

export function navSections(sections) {
    return sections.map((s) => ({...s, groups: navGroups(s.groups.filter((g) => !untitled(g)))})).filter((s) => s.groups.length);
}

export function navMark(g, searching) {
    if (g.mark) return {kind: "count", text: g.mark};
    if (searching) return {kind: "count", text: String(counted(g))};
    if (g.head && g.head.off) return {kind: "off", text: "Off"};
    return groupRows(g).some((r) => r.changed) ? {kind: "changed", text: ""} : {kind: "", text: ""};
}

export const resettable = (row) => Boolean(row.changed) && (row.shipped !== undefined || Boolean(row.timing));

export function resets(row) {
    const steps = [];
    if (row.shipped !== undefined && !same(row.value, row.shipped)) steps.push(["change", row.shipped]);
    if (row.timing && row.timing.changed) steps.push(["timing", row.timing.shipped]);
    return steps;
}
