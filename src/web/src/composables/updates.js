import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {wait} from "../platform/timing.js";

const CHECK_TRIES = 20;
const UPDATE_TRIES = 150;

export function useUpdates() {
    const about = ref(null);
    const error = ref("");
    const target = ref("");

    const status = computed(() => {
        const a = about.value;
        if (!a) return null;
        if (target.value) return {busy: true, text: `Updating to ${target.value}. The page reloads when it's done.`};
        if (a.repository) return {text: "This is the journal's own repository, so it updates from its own code, not from a release."};
        if (a.checking) return {busy: true, text: "Checking for a newer version…"};
        if (a.newer) return {text: `Version ${a.latest} is out.`, update: true};
        return a.latest ? {text: "This is the newest version."} : null;
    });

    async function load() {
        about.value = await api.changelog();
    }

    async function check() {
        await api.checkForUpdate();
        for (let tries = 0; tries < CHECK_TRIES; tries++) {
            await load();
            if (!about.value.checking) return;
            await wait(1000);
        }
    }

    async function update() {
        target.value = about.value.latest;
        error.value = "";
        try {
            await api.update();
        } catch (failed) {
            target.value = "";
            error.value = failed.message;
            return;
        }
        for (let tries = 0; tries < UPDATE_TRIES; tries++) {
            await wait(2000);
            const now = await api.changelog().catch(() => null);
            if (now && now.version === target.value) return location.reload();
        }
        target.value = "";
        error.value = "The update is taking longer than expected. It carries on in the background; reload this page in a while.";
    }

    async function start() {
        try {
            await load();
            await check();
        } catch (failed) {
            error.value = failed.message;
        }
    }

    return {about, error, status, load, update, start};
}
