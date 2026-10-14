import {route} from "./route.js";

async function send(method, path, body) {
    const response = await fetch(`/api${path}`, {
        method,
        headers: {"Content-Type": "application/json", "X-Journal-Env": route.env},
        body: body === undefined ? undefined : JSON.stringify(body),
    });
    const data = await response.json().catch(() => ({}));
    if (!response.ok) throw new Error(data.error || `${response.status}`);
    return data;
}

export const api = {
    environments: () => send("GET", "/environments"),
    newEnvironment: (name) => send("POST", "/environments", {name}),
    agents: () => send("GET", "/agents"),
    typeToAgent: (line) => send("POST", "/agents/type", {line}),
    messages: (limit = 50, before = null) => send("GET", `/messages?limit=${limit}${before ? `&before=${before}` : ""}`),
    sendMessage: (text, reply_to = null) => send("POST", "/messages", {text, reply_to}),
    questions: () => send("GET", "/questions?limit=20"),
    answer: (id, answer) => send("POST", `/questions/${id}/answer`, {answer}),
    tasks: (limit = 100) => send("GET", `/tasks?limit=${limit}`),
    createTask: (title, brief) => send("POST", "/tasks", {title, brief}),
    startTask: (id) => send("POST", `/tasks/${id}/start`),
    finishTask: (id, how) => send("POST", `/tasks/${id}/finish`, {how}),
    plans: () => send("GET", "/plans"),
    createPlan: (title, brief) => send("POST", "/plans", {title, brief}),
    planTasks: (id) => send("GET", `/plans/${id}/tasks`),
    addPlanTask: (id, title) => send("POST", `/plans/${id}/tasks`, {title}),
    facts: () => send("GET", "/facts"),
    rules: () => send("GET", "/rules"),
    reminders: () => send("GET", "/reminders"),
    create: (kind, body) => send("POST", `/${kind}`, body),
    workers: () => send("GET", "/workers"),
    entries: (limit = 100, before = null) => send("GET", `/entries?limit=${limit}${before ? `&before=${before}` : ""}`),
    since: (id) => send("GET", `/entries/since?since=${id}`),
    settings: () => send("GET", "/settings"),
    voice: () => send("GET", "/settings/voice"),
    settingValues: () => send("GET", "/settings/values"),
    setSetting: (key, value) => send("POST", "/settings", {key, value}),
};
