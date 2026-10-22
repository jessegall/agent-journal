import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {wait} from "../platform/timing.js";
import {begin, fail, runLate, updating} from "../state/updating.js";

const UPDATE_TRIES = 450;

// The newer release installed: the update is asked for, and the page reloads once the journal answers as that version; an
// update the journal says is no longer under way, with a problem, failed, and the cover comes down with why.
export async function runUpdate(version) {
    begin(version);
    try {
        await api.update();
    } catch (failed) {
        fail(failed.message);
        return failed.message;
    }
    for (let tries = 0; tries < UPDATE_TRIES; tries++) {
        await wait(2000);
        const now = await api.releases().catch(() => null);
        if (now && now.installed === version) return location.reload();
        if (now && !now.updating && now.problem) {
            fail(now.problem);
            return now.problem;
        }
    }
    runLate();
    return "The update is taking longer than expected. It carries on in the background; reload this page in a while.";
}

export function useUpdates() {
    const about = ref(null);
    const error = ref("");

    const status = computed(() => {
        const a = about.value;
        if (!a) return null;
        if (updating.version && !updating.failure && !updating.late) return {busy: true, text: `Updating to ${updating.version}. The page reloads when it's done.`};
        if (a.updating) return {busy: true, text: `Updating to ${a.updating}…`};
        if (a.problem) return {text: a.problem};
        if (a.newer) return {text: a.branch ? `${a.branch} has a newer commit, ${a.latest}.` : `Version ${a.latest} is out.`, update: true};
        return a.latest ? {text: a.branch ? `This is the newest commit of ${a.branch}.` : "This is the newest version."} : null;
    });

    async function update() {
        error.value = "";
        const problem = await runUpdate(about.value.latest);
        if (problem) error.value = problem;
    }

    async function start() {
        try {
            about.value = await api.freshReleases();
        } catch (failed) {
            error.value = failed.message;
        }
    }

    async function loadMore() {
        const next = await api.changelog(about.value.shown);
        about.value = {...about.value, changelog: about.value.changelog + next.changelog, shown: next.shown, is_last_page: next.is_last_page};
    }

    return {about, error, status, update, start, loadMore};
}
