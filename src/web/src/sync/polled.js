import {api} from "../api/client.js";
import {store} from "../state/store.js";
import {heardEvents} from "./rows.js";

const LIVE = 5;
const newest = () => (store.events.length ? store.events[store.events.length - 1].id : 0);

export const polled = {
    bar: ["bar", () => api.bar(), 500, (got) => Array.isArray(got && got.queue) && (store.bar = got)],
    agents: ["agents", () => api.agents(LIVE), 1000, (got) => (store.agents = got)],
    pages: ["pages", () => api.pages(), 5000, (got) => (store.pages = got)],
    online: ["online", () => api.onlineAgents(), 5000, (got) => (store.online = got)],
    journals: ["journals", () => api.journals(), 10000, (got) => (store.journals = got)],
    manifest: ["manifest", () => api.manifest(), 30000, (got) => (store.spec = got)],
    events: ["events", () => api.events(newest()), 5000, (fresh) => fresh.length && heardEvents(fresh)],
};
