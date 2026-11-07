import {ref} from "vue";

export const SHELL_KEYS = {
    environments: {line: "environment list"},
    "active-environments": {line: "agent environments", events: ["agent.*"]},
    branch: {line: "git-overview current", reload_seconds: 30},
    usage: {line: "usage show", reload_seconds: 10},
    fitness: {line: "usage fitness", loading: "requested"},
    controls: {line: "agent controls {agent}", loading: "requested"},
    programs: {line: "agent programs", loading: "requested"},
    skills: {line: "agent-skill list", loading: "requested"},
    phones: {line: "phone list", events: ["phone.*"]},
    bars: {line: "usage bars"},
    activity: {line: "event list --limit 30", tab: "activity", reload_seconds: 5},
    update: {line: "update check"},
    pins: {line: "pin list", loading: "requested"},
    "suite-presets": {line: "suite presets {environment} {page}"},
    "person-presets": {line: "person-preset list"},
};

export async function shellKeysAnswer(answer, init, url) {
    const query = new URL(url, "http://localhost").searchParams;
    const only = init.headers["x-journal-data-only"];
    const names = only ? only.split(",") : Object.keys(SHELL_KEYS).filter((name) => !SHELL_KEYS[name].loading && (!SHELL_KEYS[name].tab || SHELL_KEYS[name].tab === query.get("tab")));
    const keys = {};
    for (const name of names) {
        const entry = SHELL_KEYS[name];
        let line = entry.line.replace(/\{([^}]+)\}/g, (_, flag) => query.get(`${name}.${flag}`));
        for (const [flag, value] of query) {
            if (flag.startsWith(`${name}.`) && !entry.line.includes(`{${flag.slice(name.length + 1)}}`)) line += ` --${flag.slice(name.length + 1)} ${value}`;
        }
        keys[name] = await (await answer("/api/line", {...init, body: JSON.stringify({window: "viewer.shell", environment: query.get("environment"), line: line.split(" ")})})).json();
    }
    const declared = Object.fromEntries(Object.entries(SHELL_KEYS).map(([name, key]) => [name, {tab: key.tab ?? null, events: key.events ?? [], reload_seconds: key.reload_seconds ?? 0, loading: key.loading ?? "first", page_size: 0}]));
    return {ok: true, json: async () => ({keys, declared})};
}

export const lineAnswer = (run) => async (url, init) => {
    if (url !== "/api/line") return {ok: true, json: async () => ({})};
    const answer = await run(JSON.parse(init.body).line);
    return {ok: true, json: async () => ({code: answer.ok ? 0 : 1, value: answer.value, error: answer.error ?? ""})};
};

export async function presetProps(run, environment = "main", page = "home") {
    const props = {"suite-presets": {data: ref(null)}, "person-presets": {data: ref(null)}};
    const reload = async (name) => {
        const answer = await run(name === "suite-presets" ? ["suite", "presets", environment, page] : ["person-preset", "list", "--page", page]);
        props[name].data.value = answer.ok ? answer.value : null;
    };
    await reload("suite-presets");
    await reload("person-presets");
    return {props, reload};
}
