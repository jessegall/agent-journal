import {ref} from "vue";
import {api} from "../api/client.js";

// A plugin's install from a source, or its upgrade, each shown first as a preview of what it will do.
export function usePluginInstall(busy = ref(""), fresh = () => {}) {
    const previewText = ref("");
    const previewed = ref(null);
    const outcome = ref(null);

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
        try {
            const upgrading = previewed.value.upgrading;
            const installed = upgrading ? await api.upgradePlugin(upgrading) : await api.installPlugin(source);
            const skipped = installed.skipped_aliases?.length ? ` Its aliases ${installed.skipped_aliases.join(", ")} were not added: those names are taken.` : "";
            outcome.value = {ok: true, text: `${installed.manifest.title || installed.name} is ${upgrading ? "up to date" : "installed"}.${skipped}`};
            if (!upgrading) fresh(installed.name, installed);
        } catch (e) {
            outcome.value = {ok: false, text: e.message};
        }
        busy.value = "";
    }

    async function upgrade(p) {
        busy.value = `${p.id}`;
        try {
            previewed.value = {...(await api.previewUpgrade(p.id)), upgrading: p.id};
            outcome.value = null;
        } catch (e) {
            previewText.value = e.message;
        }
        busy.value = "";
    }

    return {previewText, previewed, outcome, preview, install, upgrade, closePreview};
}
