<script setup>
import {computed, onMounted, ref} from "vue";
import {api} from "../api.js";
import Btn from "../kit/Btn.vue";
import {remembered, store} from "../store.js";

const upstream = ref(null);
const dismissed = ref(remembered("journal.upgrade.dismissed", ""));
const lines = ref([]);
const running = ref(false);
const shown = computed(() => upstream.value && upstream.value.newer && dismissed.value !== upstream.value.latest);

onMounted(async () => {
    try {
        upstream.value = await api("GET", "/upstream");
    } catch (e) {}
});

function dismiss() {
    dismissed.value = upstream.value.latest;
    try {
        localStorage.setItem("journal.upgrade.dismissed", JSON.stringify(dismissed.value));
    } catch (e) {}
}

async function upgrade() {
    running.value = true;
    try {
        lines.value = (await api("POST", "/upgrade")).lines;
    } catch (e) {
        lines.value = [e.message];
    } finally {
        running.value = false;
    }
}
</script>

<template>
    <template v-if="shown">
        <div class="band">
            <span class="text">
                Agent journal {{ upstream.latest }} is out — this is {{ upstream.installed }}.
                <template v-if="lines.length">
                    <span class="done">{{ lines.join(" · ") }} — restart the viewer and journal claude.</span>
                </template>
            </span>
            <template v-if="!lines.length">
                <Btn kind="primary" small :disabled="running" @click="upgrade">{{ running ? "Upgrading…" : "Upgrade" }}</Btn>
            </template>
            <Btn small @click="dismiss">Not now</Btn>
        </div>
    </template>
</template>

<style scoped>
.band {
    flex: none;
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 6px 16px 6px 20px;
    border-bottom: 1px solid color-mix(in srgb, var(--accent) 40%, var(--border));
    background: color-mix(in srgb, var(--accent) 12%, var(--bg));
    font-size: 12.5px;
    color: var(--text-2);
}

.text {
    flex: 1;
    min-width: 0;
}

.done {
    color: var(--text-3);
}
</style>
