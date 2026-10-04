import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {heardEvents} from "./rows.js";
import {readSummary} from "./summary.js";

const LIVE = 5;
const newest = () => (store.events.length ? store.events[store.events.length - 1].id : 0);
const polledTo = {env: "", id: 0};

function pollEvents() {
    if (polledTo.env !== api.env()) Object.assign(polledTo, {env: api.env(), id: newest()});
    return api.events(polledTo.id);
}

function heardPolled(fresh) {
    if (!fresh.length) return;
    polledTo.id = fresh[fresh.length - 1].id;
    heardEvents(fresh);
}

export const polled = {
    bar: ["bar", () => api.bar(), 500, (got) => Array.isArray(got && got.queue) && (store.bar = got)],
    agents: ["agents", () => api.agents(LIVE), 1000, (got) => (store.agents = got)],
    pages: ["pages", () => api.pages(), 5000, (got) => (store.pages = got)],
    organization: ["organization", () => api.organization(), 10000, (got) => (store.organization = got)],
    ticketTodos: ["ticketTodos", () => api.ticketTodos(), 10000, (got) => Array.isArray(got) && (store.ticketTodos = got)],
    online: ["online", () => api.onlineAgents(), 5000, (got) => (store.online = got)],
    journals: ["journals", () => api.journals(), 2000, (got) => (store.journals = got)],
    summary: ["summary", readSummary, 4000],
    manifest: ["manifest", () => api.manifest(), 30000, (got) => (store.spec = got)],
    events: ["events", pollEvents, 5000, heardPolled],
};
