import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {wait} from "../platform/timing.js";
import {begin, fail, runLate, updating} from "../state/updating.js";

const CHECK_TRIES = 20;
const UPDATE_TRIES = 150;

export async function runUpdate(version, yes = false, chosen = "") {
    begin(version);
    try {
        await api.update(yes, chosen);
    } catch (failed) {
        fail(failed.message);
        return failed.message;
    }
    for (let tries = 0; tries < UPDATE_TRIES; tries++) {
        await wait(2000);
        const now = await api.changelog().catch(() => null);
        if (now && now.version === version) return location.reload();
    }
    runLate();
    return "The update is taking longer than expected. It carries on in the background; reload this page in a while.";
}

export function useUpdates() {
    const about = ref(null);
    const error = ref("");
    const releases = ref([]);

    const status = computed(() => {
        const a = about.value;
        if (!a) return null;
        if (updating.version && !updating.failure && !updating.late) return {busy: true, text: `Updating to ${updating.version}. The page reloads when it's done.`};
        if (a.repository) return {text: "This is the journal's own repository, so it updates from its own code, not from a release."};
        if (a.checking) return {busy: true, text: "Checking for a newer version…"};
        if (a.newer) return {text: `Version ${a.latest} is out.`, update: true};
        return a.latest ? {text: "This is the newest version."} : null;
    });

    async function load() {
        const now = await api.changelog();
        const kept = about.value;
        about.value = kept && kept.shown > now.shown ? {...now, changelog: kept.changelog, shown: kept.shown, more: kept.more} : now;
    }

    async function loadMore() {
        const next = await api.changelog(about.value.shown);
        about.value = {...about.value, changelog: about.value.changelog + next.changelog, shown: next.shown, more: next.more};
    }

    async function loadReleases() {
        releases.value = (await api.releases()).versions;
    }

    async function check() {
        await api.checkForUpdate();
        for (let tries = 0; tries < CHECK_TRIES; tries++) {
            await load();
            if (!about.value.checking) return;
            await wait(1000);
        }
    }

    async function update(yes = false, version = "") {
        error.value = "";
        const problem = await runUpdate(version || about.value.latest, yes, version);
        if (problem) error.value = problem;
    }

    async function start() {
        try {
            await load();
            await Promise.all([check(), loadReleases().catch(() => {})]);
        } catch (failed) {
            error.value = failed.message;
        }
    }

    const changed = computed(() => about.value?.changed || []);

    return {about, changed, releases, error, status, load, loadMore, update, start};
}
