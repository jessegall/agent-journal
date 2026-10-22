import {agent} from "../composables/leadAgent.js";
import {store} from "../state/store.js";
import {followServer, STATUS_POLL, updating} from "../state/updating.js";
import {isActive} from "../domain/journals.js";
import {api} from "../api/client.js";
import {usePoll} from "../composables/poll.js";
import {takeEntries} from "./rows.js";
import {floatWindow} from "../platform/view.js";
import {barOn} from "../composables/settings.js";

const LIVE = 5;
const BUSY_EVERY = 500;
const CALM_EVERY = 3000;
const newest = () => (store.entries.length ? store.entries[store.entries.length - 1].id : 0);
const polledTo = {env: "", id: 0};
const busy = () => Boolean(store.bar && store.bar.length) || isActive(agent.value && agent.value.status);

function pollEntries() {
    if (polledTo.env !== api.env()) Object.assign(polledTo, {env: api.env(), id: newest()});
    return api.entries(polledTo.id);
}

function takePolled(fresh) {
    if (!fresh.length) return;
    polledTo.id = fresh[fresh.length - 1].id;
    takeEntries(fresh);
}

export const polled = {
    bar: {
        key: "bar",
        ask: () => api.bar(),
        every: () => (busy() ? BUSY_EVERY : CALM_EVERY),
        take: (got) => Array.isArray(got) && (store.bar = got),
        active: () => barOn.value,
    },
    agents: {key: "agents", ask: () => api.list("agents", {limit: LIVE}), every: 1000, take: (got) => (store.agents = got.rows)},
    live: {key: "live", ask: () => api.liveAgents(), every: 5000, take: (got) => (store.live = got)},
    summary: {
        key: STATUS_POLL,
        ask: () => api.summary(),
        every: () => (updating.countdown || updating.external || updating.version ? 1000 : 4000),
        take: (got) => {
            store.summary = got;
            followServer(got);
        },
    },
    manifest: {key: "manifest", ask: () => api.manifest(), every: 30000, take: (got) => (store.spec = got)},
    journals: {key: "journals", ask: () => api.journals(), every: 10000, take: (got) => (store.journals = got)},
    people: {key: "people", ask: () => api.people(), every: 30000, take: (got) => got && got.people && (store.people = got)},
    entries: {key: "entries", ask: pollEntries, every: 1000, take: takePolled},
};

export const windowPolls = () => Object.values(polled).filter((poll) => !(floatWindow && poll.mainWindowOnly));

export const usePolled = ({key, ask, every, take, active}) => usePoll(key, ask, every, take, active);
