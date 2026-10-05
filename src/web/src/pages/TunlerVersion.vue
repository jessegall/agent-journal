<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import TunlerInstall from "./TunlerInstall.vue";
import {checkTunnel} from "../composables/shares.js";

const version = ref(null);
const busy = ref(false);
const told = ref("");

async function run(action) {
    busy.value = true;
    told.value = "";
    try {
        told.value = await action();
        version.value = await api.tunlerVersion();
    } catch (e) {
        told.value = e.message;
    } finally {
        busy.value = false;
    }
}

async function installed(outcome) {
    told.value = outcome;
    version.value = await api.tunlerVersion();
    await checkTunnel();
}

onMounted(async () => (version.value = await api.tunlerVersion().catch(() => null)));
</script>

<template>
    <template v-if="version">
        <div class="tunler-version">
            <template v-if="version.current">
                <span class="tunler-version-name">tunler {{ version.current }}</span>
                <template v-if="version.update_available">
                    <span class="tunler-version-new">{{ version.latest || "A newer version" }} is available</span>
                    <Btn small kind="primary" :busy="busy" @click="run(() => api.updateTunler())">Update tunler</Btn>
                </template>
                <template v-else>
                    <span class="tunler-version-new">up to date</span>
                </template>
            </template>
            <template v-else>
                <span class="tunler-version-new">tunler is not installed on this machine</span>
                <TunlerInstall @installed="installed" />
            </template>
            <template v-if="told">
                <span class="tunler-version-told">{{ told }}</span>
            </template>
        </div>
    </template>
</template>

<style scoped>
.tunler-version {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    padding: 12px 16px;
    border-top: 1px solid var(--line);
}

.tunler-version-name {
    color: var(--text-2);
    font-family: var(--mono);
    font-size: 12.5px;
}

.tunler-version-new {
    color: var(--text-3);
    font-size: 12.5px;
}

.tunler-version-told {
    flex-basis: 100%;
    color: var(--text-2);
    font-size: 12.5px;
}
</style>
