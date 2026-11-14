import {mounted as mountDelayed, settle as settleDelayed} from "./delayedWindowContext.js";
import {context as baseContext, pickButton as pick} from "./windowContext.js";
import {MAIN, OTHERS, EVERYONE, PAGE_ROWS, AGENT_ROWS, ROLES, isAgent, agentIdOf} from "../../../core/modules/memories/web/src/memoryScope.js";

// a word in a command line, in quotes when it holds anything but letters, digits, dashes and dots
const quoted = (text) => (/^[\w.-]+$/.test(text) ? text : `"${text.replaceAll("\\", "\\\\").replaceAll('"', '\\"')}"`);

// what a `who` asks of `memory list`
const WHO_FLAGS = {[MAIN]: " --main-agent", [OTHERS]: " --other-agents", [EVERYONE]: ""};
const whoFlags = (who) => (isAgent(who) ? ` --agent ${agentIdOf(who)}` : WHO_FLAGS[who]);

// a list leaves removed memories out unless it asks for them
const STATE_FLAGS = {active: " --state active", removed: " --removed --state removed", all: " --removed"};

// the memories of one `who` in the environment: active, removed or both, those holding every word searched, in the order asked
export function memoryLine({who, environment, state = "active", search = "", order = "newest", limit = PAGE_ROWS}) {
    const searchFlag = search.trim() ? ` --search ${quoted(search.trim())}` : "";
    return `memory list${whoFlags(who)} --environment ${quoted(environment)}${STATE_FLAGS[state]}${searchFlag} --order ${order} --limit ${limit}`;
}

// the number of active memories of one `who`, read as a page of one row
export const countLine = (who, environment) => memoryLine({who, environment, limit: 1});

// the agents holding memories: those at work or those ended, of one kind, whose name holds every word
export function agentsLine({environment, ended, role = "all", name = "", limit = AGENT_ROWS}) {
    const roleFlag = ROLES.find((choice) => choice.key === role).flag;
    const nameFlag = name.trim() ? ` --name ${quoted(name.trim())}` : "";
    return `memory agents --environment ${quoted(environment)}${roleFlag}${nameFlag} ${ended ? "--ended" : "--working"} --limit ${limit}`;
}

// the agents behind a page of memories, read together by number
export const namesLine = (ids) => `memory agents --agents ${[...new Set(ids)].join(" ")} --limit ${new Set(ids).size}`;


const keys = {
    counts: {events: ["memory.*"]},
    memories: {events: ["memory.*"], loading: "requested"},
    working: {events: ["agent.*", "memory.*"], loading: "requested"},
    ended: {events: ["agent.*", "memory.*"], loading: "requested"},
    selected: {events: ["agent.*"], loading: "requested"},
};

function line(name, state) {
    const get = (flag) => state[`${name}.${flag}`];
    if (name === "counts") return "memory counts";
    if (name === "selected") return `agent show ${get("id")}`;
    if (name === "working" || name === "ended") return agentsLine({environment: get("environment"), ended: name === "ended", role: get("access") || "all", name: get("name") || "", limit: Number(get("limit"))});
    const who = name === "main-count" || get("main-agent") === "true" ? "main" : name === "other-count" || get("other-agents") === "true" ? "others" : get("agent") ? `agent:${get("agent")}` : "everyone";
    return memoryLine({who, environment: get("environment"), state: get("state") || (get("removed") ? "all" : "active"), search: get("search") || "", order: get("order") || "newest", limit: Number(get("limit"))}).replace("memory list", "memory page");
}

export function context(answers) {
    const total = (line) => {
        const key = Object.keys(answers).find((start) => line.startsWith(start));
        const answer = answers[key];
        return answer?.ok ? answer.value.total : 0;
    };
    const counts = {main_count: total("memory list --main-agent --environment main"), agent_count: total("memory list --other-agents"), total: total("memory list --environment main")};
    const pages = Object.fromEntries(Object.entries(answers).filter(([key]) => key.startsWith("memory list")).map(([key, answer]) => {
        if (!answer.ok) return [key.replace("memory list", "memory page"), answer];
        const agents = answers["memory agents --agents"]?.value.rows || [];
        return [key.replace("memory list", "memory page"), {...answer, value: {...answer.value, agents}}];
    }));
    const result = baseContext({"memory counts": {ok: true, value: counts}, ...pages, ...answers});
    result.readKeys = async ({only = [], state = {}}) => {
        const names = only.length ? only : Object.keys(keys).filter((name) => !keys[name].loading);
        const results = await Promise.all(names.map((name) => result.read(line(name, state))));
        const declared = Object.fromEntries(Object.entries(keys).map(([name, key]) => [name, {events: key.events, loading: key.loading || "first", tab: null, reload_seconds: 0, page_size: 0}]));
        return {ok: true, value: {declared, keys: Object.fromEntries(names.map((name, index) => [name, results[index]]))}};
    };
    return result;
}

export async function settle() {
    await settleDelayed(100);
}
export async function mounted(component, window) {
    return mountDelayed(component, window, 100);
}
export async function pickButton(...args) {
    await pick(...args);
    await settle();
}
export {page, typeInto} from "./windowContext.js";
