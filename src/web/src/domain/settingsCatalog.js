export const COUNTED = ["percent", "uses", "minutes"];
export const EVENTS = ["idle", "worked", "start"];

const UNIT_WORDS = {percent: "% of context", uses: "tool calls", minutes: "minutes", notices: "journal lines"};
const EVENT_WORDS = {idle: "when the agent rests", worked: "after the agent works", start: "at session start"};
const HOURS = {60: "every hour", 1440: "every day"};
const OFF_LINE = "Off. Turn it on to change these.";

export const UNIT_CHOICES = {percent: "% of context", uses: "tool calls", minutes: "minutes", notices: "journal lines"};
export const EVENT_CHOICES = {idle: "the agent rests", worked: "after work", start: "a session starts"};

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
    const stored = target.invert ? !value : value;
    if (target.sparse && same(stored, target.shipped)) delete base[key];
    else base[key] = stored;
    return {[top]: base};
}

const capital = (text) => text.charAt(0).toUpperCase() + text.slice(1);

function choiceOptions(choices, value) {
    const options = choices.map((key) => ({key, label: capital(key)}));
    return choices.includes(value) || !value ? options : [...options, {key: value, label: value}];
}

function row(fields) {
    const complete = {indent: false, hint: "", words: "", ...fields};
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
        target: {path: ["features", name]},
    });
}

function settingRow(f, setting, settings) {
    const value = (settings[f.name] || {})[setting.name] ?? setting.default;
    const defaults = Object.fromEntries(f.settings.map((s) => [s.name, s.default]));
    return row({
        key: `${f.name}:${setting.name}`,
        kind: setting.kind,
        label: setting.title,
        hint: setting.abstract,
        unit: setting.unit,
        indent: Boolean(setting.under),
        options: setting.kind === "choice" ? choiceOptions(setting.choices, value) : [],
        value,
        shipped: setting.default,
        target: {path: [f.name, setting.name], sparse: true, shipped: setting.default, defaults},
    });
}

function featureRows(f, settings, extras) {
    const declared = f.settings.filter((s) => s.kind !== "map");
    const under = (key) => declared.filter((s) => s.under === key).map((s) => settingRow(f, s, settings));
    const own =
        hasTiming(f.trigger) && f.trigger_label
            ? [row({key: `${f.name}:timing`, kind: "timing", label: f.trigger_label, timing: timing(f.name, f.trigger, settings)})]
            : [];
    return [
        ...own,
        ...Object.entries(f.behaviours).flatMap(([key, b]) => [behaviourRow(f, key, b, settings), ...under(key)]),
        ...declared.filter((s) => !s.under).map((s) => settingRow(f, s, settings)),
        ...(extras[f.name] || []),
    ];
}

function featureHead(f, label, hint, settings) {
    const shared = {
        key: f.name,
        label,
        hint,
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
        help: f.help,
        head: featureHead(f, f.label, f.hint, settings),
        rows: featureRows(f, settings, extras),
    };
}

function normalised(f) {
    const settings = (f.settings || []).filter((s) => s.kind !== "map");
    return {
        ...f,
        settings: f.settings || [],
        behaviours: f.behaviours || {},
        parts: Object.keys(f.behaviours || {}).length + settings.length,
    };
}

function group(g, members, settings, loose) {
    const lead = members.find((f) => f.name === g.lead);
    const rest = members.filter((f) => f !== lead).sort((a, b) => a.label.localeCompare(b.label));
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
        help: lead ? lead.help : "",
        head,
        items: [
            ...(lead ? featureRows(lead, settings, extras) : []),
            ...(loose.rows[g.key] || []),
            ...flat.map((f) => featureHead(f, f.label, f.hint, settings)),
            ...blocks.map((f) => block(f, settings, extras)),
        ],
        always: always.map((f) => f.label),
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
            journal: [
                row({
                    key: "color",
                    kind: "color",
                    label: "Project color",
                    hint: "The band that tells this project apart from other open journals",
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
                    hint: "Off: they are typed into its terminal instead",
                    words: "channel delivery",
                    value: delivery.channel ?? true,
                    shipped: true,
                    target: {path: ["delivery", "channel"], sparse: true, shipped: true},
                }),
                row({
                    key: "extension",
                    kind: "buttons",
                    label: "Chrome extension",
                    hint: "The chat on any page; the agent can see and use the tab",
                    words: "browser download",
                    buttons: extension.available
                        ? [
                              ...(extension.store ? [{key: "store", label: "Add to Chrome", href: extension.store}] : []),
                              {key: "zip", label: "Download", href: context.extensionZip},
                          ]
                        : [],
                }),
                row({
                    key: "services",
                    kind: "buttons",
                    label: "Services",
                    hint: "Start, stop and read the logs of the journal's processes",
                    words: "processes server tunnel plugin log restart",
                    buttons: [{key: "services", label: "Show services"}],
                }),
            ],
            viewer: [
                row({
                    key: "away",
                    kind: "switch",
                    label: "Show what happened while you were away",
                    hint: "A card when you come back to this tab",
                    value: viewer.away !== false,
                    shipped: true,
                    target: {path: ["viewer", "away"]},
                }),
                row({
                    key: "tour",
                    kind: "switch",
                    label: "Show the Home tour",
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
                          label: "Skip permission prompts",
                          hint: "Restarts the agent in the same conversation",
                          value: Boolean(permissions.skip),
                          shipped: false,
                          target: {action: "relaunch"},
                      }),
                  ]
                : [],
            auto_archive: [
                keepRow("report", "Keep reports for", "0 keeps them listed", 14),
                keepRow("todo", "Keep finished to-dos for", "", 7),
            ],
            dev_faults: [
                row({
                    key: "diagnostics",
                    kind: "buttons",
                    label: "Developer error log",
                    hint: "Slow requests and errors, as written to .journal/runtime/diagnostics.log",
                    words: "diagnostics log errors slow",
                    buttons: [{key: "diagnostics", label: "Show the log"}],
                }),
            ],
        },
        danger: {
            journal: context.demo
                ? []
                : [
                      row({
                          key: "stop",
                          kind: "danger",
                          label: "Stop the journal",
                          hint: "Closes the viewer, the engine and every plugin. Nothing is deleted.",
                          words: "shut down quit engine viewer",
                          buttons: [{key: "stop", label: context.stopping ? "Stopping" : "Stop"}],
                      }),
                  ],
        },
    };
}

export const LINKS = [
    {key: "environments", title: "Environments", line: "Opens the list of environments"},
    {key: "tunnel", title: "Tunler", line: "Opens the tunler account and its domains"},
];

export function catalog(spec, settings, context) {
    const features = Object.values(spec.features || {}).map(normalised);
    const loose = looseRows(settings || {}, context);
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

export function navMark(g, searching) {
    if (searching) return {kind: "count", text: String(counted(g))};
    if (g.head && g.head.off) return {kind: "off", text: "Off"};
    return groupRows(g).some((r) => r.changed) ? {kind: "changed", text: ""} : {kind: "", text: ""};
}
