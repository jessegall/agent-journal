import {ref} from "vue";
import {api} from "../api/client.js";
import {pollKey, startPoll} from "./poll.js";

const LOG_EVERY = 1000;
const LOG_LINES = 5000;

export function usePluginInstall(busy = ref(""), fresh = () => {}) {
    const previewText = ref("");
    const previewed = ref(null);
    const outcome = ref(null);
    const live = ref("");
    let stopFollowing = () => {};

    async function logLines(name) {
        return (await api.pluginLog(name, LOG_LINES).catch(() => ({log: ""}))).log.split("\n");
    }

    const follow = async (name, skipped) => (live.value = (await logLines(name)).slice(skipped).join("\n"));

    function closePreview() {
        previewed.value = null;
        outcome.value = null;
    }

    async function preview(source) {
        busy.value = "preview";
        previewText.value = "";
        previewed.value = null;
        try {
            previewed.value = await api.previewPlugin(source);
        } catch (e) {
            previewText.value = e.message;
        }
        busy.value = "";
    }

    async function install(source) {
        busy.value = "install";
        live.value = "";
        const name = previewed.value.name;
        const skipped = (await logLines(name)).length;
        stopFollowing = startPoll(pollKey(), () => follow(name, skipped), LOG_EVERY);
        try {
            const upgrading = previewed.value.upgrading;
            const installed = upgrading ? await api.upgradePlugin(upgrading, previewed.value.current) : await api.installPlugin(source);
            outcome.value = {ok: true, text: typeof installed === "string" ? installed : `${previewed.value.title} is up to date.`};
            if (!upgrading) fresh(name, installed);
        } catch (e) {
            outcome.value = {ok: false, text: e.message};
        }
        stopFollowing();
        await follow(name, skipped);
        busy.value = "";
    }

    async function upgrade(p) {
        busy.value = `${p.n}`;
        try {
            previewed.value = {...(await api.previewUpgrade(p.n)), upgrading: p.n};
            outcome.value = null;
        } catch (e) {
            previewText.value = e.message;
        }
        busy.value = "";
    }

    return {previewText, previewed, outcome, live, preview, install, upgrade, closePreview};
}
