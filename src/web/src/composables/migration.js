import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {report} from "../platform/faults.js";

// where bringing the kept version 3 journal across stands, as the journal says it: offered once in a dialog, then a line on Home
const migration = ref(null);

export const migrationOffered = computed(() => Boolean(migration.value?.kept) && migration.value.state === "offered");
export const migrationPutOff = computed(() => Boolean(migration.value?.kept) && migration.value.state === "later");
export const migrationRunning = computed(() => migration.value?.state === "running");

export async function loadMigration() {
    migration.value = await api.migration().catch(() => null);
}

async function sent(request, path) {
    try {
        migration.value = await request;
    } catch (error) {
        report("threw", error.message, `POST /api/migration/${path}`);
    }
}

export const putMigrationOff = () => sent(api.putMigrationOff(), "later");
export const startMigration = () => sent(api.startMigration(), "start");
