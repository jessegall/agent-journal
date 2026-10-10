import {agent} from "../composables/leadAgent.js";
import {store} from "../state/store.js";
import {counting, follow, updating} from "../state/updating.js";
import {isActive} from "../domain/journals.js";
import {api} from "../api/client.js";
import {usePoll} from "../composables/poll.js";
import {takeEvents} from "./rows.js";
import {floatWindow} from "../platform/view.js";
import {barOn} from "../composables/settings.js";

const LIVE = 5;
const BUSY_EVERY = 500;
const CALM_EVERY = 3000;
const newest = () => (store.events.length ? store.events[store.events.length - 1].id : 0);
const polledTo = {env: "", id: 0};
const busy = () => Boolean(store.bar && store.bar.queue.length) || isActive(agent.value && agent.value.data.status);

function pollEvents() {
    if (polledTo.env !== api.env()) Object.assign(polledTo, {env: api.env(), id: newest()});
    return api.events(polledTo.id);
}

function takePolled(fresh) {
    if (!fresh.length) return;
    polledTo.id = fresh[fresh.length - 1].id;
    takeEvents(fresh);
}

export const polled = {
    bar: {
        key: "bar",
        ask: () => api.bar(),
        every: () => (busy() ? BUSY_EVERY : CALM_EVERY),
        take: (got) => Array.isArray(got && got.queue) && (store.bar = got),
        active: () => barOn.value,
    },
    agents: {key: "agents", ask: () => api.agents(LIVE), every: 1000, take: (got) => (store.agents = got)},
    pages: {key: "pages", ask: () => api.pages(), every: 5000, take: (got) => (store.pages = got), mainWindowOnly: true},
    organization: {
        key: "organization",
        ask: () => api.organization(),
        every: 10000,
        take: (got) => (store.organization = got),
        mainWindowOnly: true,
    },
    ticketTodos: {
        key: "ticketTodos",
        ask: () => api.ticketTodos(),
        every: 10000,
        take: (got) => Array.isArray(got) && (store.ticketTodos = got),
    },
    online: {key: "online", ask: () => api.onlineAgents(), every: 5000, take: (got) => (store.online = got)},
    summary: {
        key: "summary",
        ask: () => api.summary(),
        every: () => (updating.countdown || updating.external || updating.version ? 1000 : 4000),
        take: (got) => {
            store.summary = got;
            counting(got.countdown);
            if (follow(Boolean(got.updating), got.step)) window.location.reload();
        },
    },
    manifest: {key: "manifest", ask: () => api.manifest(), every: 30000, take: (got) => (store.spec = got)},
    journals: {key: "journals", ask: () => api.journals(), every: 10000, take: (got) => (store.journals = got)},
    events: {key: "events", ask: pollEvents, every: 1000, take: takePolled},
};

export const windowPolls = () => Object.values(polled).filter((poll) => !(floatWindow && poll.mainWindowOnly));

export const usePolled = ({key, ask, every, take, active}) => usePoll(key, ask, every, take, active);
