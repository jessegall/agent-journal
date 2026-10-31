import {computed, ref} from "vue";
import {api} from "../api/client.js";

// where bringing the kept version 3 journal across stands, as the journal says it: offered once in a dialog, then a line on Home
const migration = ref(null);

export const migrationOffered = computed(() => Boolean(migration.value?.kept) && migration.value.state === "offered");
export const migrationPutOff = computed(() => Boolean(migration.value?.kept) && migration.value.state === "later");
export const migrationRunning = computed(() => migration.value?.state === "running");

export async function loadMigration() {
    migration.value = await api.migration().catch(() => null);
}

export const putMigrationOff = async () => (migration.value = await api.putMigrationOff());
export const startMigration = async () => (migration.value = await api.startMigration());
