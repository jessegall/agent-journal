import {providerName} from "./agents.js";

export const DIAGNOSTICS_LINE = "Slow pages and errors, saved on your computer for the developer";

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

function behaviourRow(f, key, b, settings) {
    const name = `${f.name}.${key}`;
    return row({
        key: name,
        kind: "switch",
        label: b.title,
        hint: b.abstract,
        value: switchValue(settings, name, b.default),
        shipped: b.default,
        timing: timing(name, b.trigger, settings),
        prefix: b.prefix,
        target: {path: ["features", name]},
    });
}

function settingRow(f, setting, settings) {
    const saved = (settings[f.name] || {})[setting.name] ?? setting.default;
    const value = setting.kind !== "choice" || setting.choices.includes(saved) ? saved : setting.default;
    const defaults = Object.fromEntries(f.settings.map((s) => [s.name, s.default]));
    return row({
        key: `${f.name}:${setting.name}`,
        kind: setting.kind,
        label: setting.title,
        hint: setting.abstract,
        unit: setting.unit,
        indent: Boolean(setting.under),
        options: setting.kind === "choice" ? choiceOptions(setting) : [],
        example: (setting.examples || {})[value] || "",
        value,
        shipped: setting.default,
        target: {path: [f.name, setting.name], sparse: true, shipped: setting.default, defaults},
    });
}

function modelRows(f, setting, settings) {
    const saved = {...setting.default, ...((settings[f.name] || {})[setting.name] || {})};
    const defaults = Object.fromEntries(f.settings.map((s) => [s.name, s.default]));
    return Object.entries(setting.choices).map(([provider, models]) => {
        const value = models.includes(saved[provider]) ? saved[provider] : setting.default[provider];
        const named = setting.labels[provider] || {};
        return row({
            key: `${f.name}:${setting.name}:${provider}`,
            kind: "choice",
            label: `${setting.title} on ${providerName(provider)}`,
            hint: setting.abstract,
            indent: Boolean(setting.under),
            options: (models.length ? models : [value]).map((key) => ({key, label: named[key] || key})),
            value,
            shipped: setting.default[provider],
            target: {path: [f.name, setting.name], provider, saved, sparse: true, shipped: setting.default, defaults},
        });
    });
}

const settingRows = (f, setting, settings) => (setting.kind === "models" ? modelRows(f, setting, settings) : [settingRow(f, setting, settings)]);

function featureRows(f, settings, extras) {
    const declared = f.settings.filter((s) => s.kind !== "map" && !s.hidden);
    const under = (key) => declared.filter((s) => s.under === key).flatMap((s) => settingRows(f, s, settings));
    const own =
        hasTiming(f.trigger) && f.trigger_label
            ? [row({key: `${f.name}:timing`, kind: "timing", label: f.trigger_label, timing: timing(f.name, f.trigger, settings)})]
            : [];
    return [
        ...own,
        ...Object.entries(f.behaviours).flatMap(([key, b]) => [behaviourRow(f, key, b, settings), ...under(key)]),
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
        head: featureHead(f, f.label, f.hint, settings),
        rows: featureRows(f, settings, extras),
    };
}

function normalised(f) {
    const settings = (f.settings || []).filter((s) => s.kind !== "map" && !s.hidden);
    return {
        ...f,
        settings: f.settings || [],
        behaviours: f.behaviours || {},
        parts: Object.keys(f.behaviours || {}).length + settings.length,
    };
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
        head,
        items: [
            ...(lead ? featureRows(lead, settings, extras) : []),
            ...(loose.rows[g.key] || []),
            ...rest
                .filter((f) => flat.includes(f) || blocks.includes(f))
                .map((f) => (flat.includes(f) ? featureHead(f, f.label, f.hint, settings) : block(f, settings, extras))),
        ],
        always: always.map((f) => ({key: f.name, label: f.label, explains: f.explains})),
        danger: loose.danger[g.key] || [],
    };
}

function looseRows(settings, context) {
    const delivery = settings.delivery || {};
    const viewer = settings.viewer || {};
    const permissions = settings.permission_prompts || {};
    const identity = context.identity || {};
    const extension = context.extension || {};
    const keep = settings.keep || {};
    const keepRow = (type, label, hint, shipped) =>
        row({
            key: `keep:${type}`,
            kind: "number",
            label,
            hint,
            unit: "days",
            value: keep[type] ?? shipped,
            shipped,
            target: {path: ["keep", type], sparse: true, shipped},
        });
    return {
        rows: {
            models: (context.models || []).map((m) =>
                row({key: `models:${m.provider}`, kind: "fixed", label: providerName(m.provider), hint: "The model it starts agents on unless one is named", value: m.label})
            ),
            project: [
                row({
                    key: "color",
                    kind: "color",
                    label: "Project color",
                    hint: "The color band that tells this project apart from other open journals",
                    words: "colour identity",
                    value: identity.color,
                    shipped: null,
                    changed: Boolean(identity.custom_color),
                    target: {action: "color"},
                }),
                row({
                    key: "channel",
                    kind: "switch",
                    label: "Deliver messages while the agent works",
                    hint: "Off: messages are typed into the agent's terminal instead",
                    words: "channel delivery",
                    value: delivery.channel ?? true,
                    shipped: true,
                    target: {path: ["delivery", "channel"], sparse: true, shipped: true},
                }),
                row({
                    key: "extension",
                    kind: "buttons",
                    label: "Chrome extension",
                    hint: "Puts the chat on any web page and lets the agent see and use that tab",
                    words: "browser download",
                    buttons: extension.available
                        ? [
                              ...(extension.store ? [{key: "store", label: "Add to Chrome", href: extension.store}] : []),
                              {key: "zip", label: "Download", href: context.extensionZip},
                          ]
                        : [],
                }),
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
                    hint: "Its name and colour fill the window briefly, so you know which journal you are in",
                    value: viewer.flash !== false,
                    shipped: true,
                    target: {path: ["viewer", "flash"]},
                }),
                row({
                    key: "tour",
                    kind: "switch",
                    label: "Show the Home tour",
                    hint: "A few short steps that show you around Home",
                    value: !viewer.tour_seen,
                    changed: false,
                    target: {path: ["viewer", "tour_seen"], invert: true},
                }),
            ],
        },
        extras: {
            permission_prompts: permissions.possible
                ? [
                      row({
                          key: "permission_prompts:skip",
                          kind: "switch",
                          label: "Allow all actions without asking",
                          hint: "Turning it on restarts the agent in the same conversation",
                          value: Boolean(permissions.skip),
                          shipped: false,
                          target: {action: "relaunch"},
                      }),
                  ]
                : [],
            auto_archive: [
                keepRow("report", "Keep reports for", "0 never archives them", 14),
                keepRow("todo", "Keep closed to-dos for", "", 7),
            ],
            dev_faults: [
                row({
                    key: "diagnostics",
                    kind: "buttons",
                    label: "Developer error log",
                    hint: DIAGNOSTICS_LINE,
                    words: "diagnostics log errors slow",
                    buttons: [{key: "diagnostics", label: "Show the log"}],
                }),
            ],
        },
        danger: {
            stop: !context.stoppable
                ? []
                : [
                      row({
                          key: "stop",
                          kind: "danger",
                          label: "Stop the journal",
                          hint: "Closes the viewer and every plugin. Nothing is deleted.",
                          words: "shut down quit viewer",
                          buttons: [{key: "stop", label: context.stopping ? "Stopping" : "Stop"}],
                      }),
                  ],
        },
    };
}

export function catalog(spec, settings, context) {
    const features = Object.values(spec.features || {}).map(normalised);
    const loose = looseRows(settings || {}, {...context, models: spec.models});
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
    {key: "agent", title: "Agent", line: "How the agent works, talks to you and keeps track of its work. Each of these can be switched off on its own."},
    {key: "features", title: "Features", line: "What the journal does besides the agent's own settings, which are in the Agent tab. Each feature can be switched off on its own."},
    {key: "system", title: "System", line: "Project settings, updates, browser settings and shutting down."},
    {key: "services", title: "Services", line: "The processes the journal and its plugins keep running. Start, stop, restart and read their logs."},
    {key: "sharing", title: "Phone and share links", line: "Your phone and share links reach this journal through the tunler account below."},
    {key: "plugins", title: "Plugins", line: "The settings of each installed plugin."},
    {key: "environments", title: "Environments", line: "The environments of this project. Each has its own to-dos, agent and history."},
    {key: "developer", title: "Developer", line: "Only needed when you work on the journal itself."},
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
