<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import {remembered} from "../composables/remembered.js";
import {store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {usePoll} from "../poll.js";
import {useNow} from "../composables/now.js";

usePoll(...polled.manifest);

const upstream = ref(null);
const dismissed = ref(remembered("journal.upgrade.dismissed", ""));
const lines = ref([]);
const running = ref(false);
const shown = computed(() => upstream.value && upstream.value.newer && dismissed.value !== upstream.value.latest);
const mine = (document.querySelector("script[type=module]") || {}).src || "";
const stale = computed(() => {
    const serving = store.spec && store.spec.build;
    return !!serving && !!mine && !mine.endsWith(serving);
});

const RELOAD_AFTER = 60;
const now = useNow();
const reloadAt = ref(0);
const left = computed(() => Math.max(0, Math.ceil(reloadAt.value - now.value)));

watch(stale, (is) => (reloadAt.value = is ? now.value + RELOAD_AFTER : 0), {immediate: true});
watch(left, (seconds) => reloadAt.value && !seconds && reload());

onMounted(async () => {
    try {
        upstream.value = await api.upstream();
    } catch (e) {}
});

function reload() {
    window.location.reload();
}

function dismiss() {
    dismissed.value = upstream.value.latest;
    try {
        localStorage.setItem("journal.upgrade.dismissed", JSON.stringify(dismissed.value));
    } catch (e) {}
}

async function upgrade() {
    running.value = true;
    try {
        lines.value = (await api.upgrade()).lines;
    } catch (e) {
        lines.value = [e.message];
    } finally {
        running.value = false;
    }
}
</script>

<template>
    <template v-if="stale">
        <div class="band">
            <span class="text">A newer version of the viewer is running. This page reloads in {{ left }}s.</span>
            <Btn kind="primary" small @click="reload">Continue</Btn>
        </div>
    </template>
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
