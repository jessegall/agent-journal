<script setup>
import {onMounted, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";

const version = ref("");
const busy = ref(false);
const told = ref("");

async function update() {
    busy.value = true;
    told.value = "";
    try {
        told.value = await api.updateTunler();
        version.value = await api.tunlerVersion();
    } catch (e) {
        told.value = e.message;
    } finally {
        busy.value = false;
    }
}

onMounted(async () => (version.value = await api.tunlerVersion().catch(() => "")));
</script>

<template>
    <template v-if="version">
        <div class="tunler-version">
            <span class="tunler-version-name">tunler {{ version }}</span>
            <Btn small :busy="busy" @click="update">Update tunler</Btn>
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

.tunler-version-told {
    flex-basis: 100%;
    color: var(--text-2);
    font-size: 12.5px;
}
</style>
