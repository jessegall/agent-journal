import {computed, ref} from "vue";
import {saveSetting} from "../../actions/settings.js";
import {stopJournal as stopServer} from "../../actions/stopJournal.js";
import {api} from "../../api/client.js";
import {catalog, counts, inTab, narrowed} from "../../domain/settingsCatalog.js";
import {demo} from "../../platform/demo.js";
import {store} from "../../state/store.js";
import {toast} from "../kit/toast.js";
import {runsAllowed} from "../runs.js";

const extension = ref(null);
const stopping = ref(false);

export const loaded = ref(false);
export const failed = ref("");

export async function loadCatalog() {
    try {
        [store.spec, store.settings, store.identity, extension.value] = await Promise.all([
            api.manifest(),
            api.settings(),
            api.identity(),
            api.extension().catch(() => null),
        ]);
        failed.value = "";
        loaded.value = true;
    } catch (error) {
        failed.value = error.message;
    }
}

export const sections = computed(() =>
    catalog(store.spec || {}, store.settings || {}, {
        identity: store.identity,
        extension: extension.value,
        extensionZip: api.extensionZip(),
        stoppable: !demo && runsAllowed.value,
        stopping: stopping.value,
    })
);

export const groupsOf = (list) => list.flatMap((section) => section.groups);
export const groupsIn = (tab) => groupsOf(inTab(sections.value, tab));
export const groupNamed = (key) => groupsOf(sections.value).find((group) => group.key === key) || null;
export const tally = computed(() => counts(sections.value));
export const only = (filter) => groupsOf(narrowed(sections.value, "", filter));

async function saved(label, work) {
    try {
        await work();
        toast(`Saved: ${label}`);
    } catch (error) {
        toast(error.message);
    }
}

export const save = (row, value) => saved(row.label, () => saveSetting(row.target, value));
export const saveTiming = (row, next) => saved(row.label, () => saveSetting(row.timing.target, next));

export async function stopJournal() {
    stopping.value = true;
    try {
        await stopServer();
    } catch (error) {
        stopping.value = false;
        toast(error.message);
    }
}
