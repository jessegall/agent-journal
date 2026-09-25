<script setup>
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import {remember, remembered} from "../composables/remembered.js";
import {store} from "../state/store.js";
import {polled} from "../sync/polled.js";
import {usePoll} from "../poll.js";
import {useNow} from "../composables/now.js";

usePoll(...polled.manifest);

const upstream = ref(null);
const dismissed = ref(remembered("journal.upgrade.dismissed", ""));
const lines = ref([]);
const running = ref(false);
const visible = computed(
    () => upstream.value && upstream.value.newer && !upstream.value.installs && dismissed.value !== upstream.value.latest
);
const mine = (document.querySelector("script[type=module]") || {}).src || "";
const stale = computed(() => {
    const serving = store.spec && store.spec.build;
    return !!serving && !!mine && !mine.endsWith(serving);
});

const RELOAD_AFTER = 60;
const now = useNow();
const remaining = ref(0);
const waiting = computed(() => store.drafting > 0);
const left = computed(() => Math.ceil(remaining.value));

watch(stale, (is) => (remaining.value = is ? RELOAD_AFTER : 0), {immediate: true});
watch(now, (at, before) => {
    if (!remaining.value || waiting.value) return;
    remaining.value = Math.max(0, remaining.value - (at - before));
    if (!remaining.value) reload();
});

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
    remember("journal.upgrade.dismissed", dismissed.value);
}

async function upgrade(always = false) {
    running.value = true;
    try {
        if (always) await api.saveSettings({features: {"auto_update.install": true}});
        await api.update();
        lines.value = [`Installing ${upstream.value.latest}; this page reloads once it runs`];
    } catch (e) {
        lines.value = [e.message];
    } finally {
        running.value = false;
    }
}
</script>

<template>
    <template v-if="stale">
        <div class="band reloading">
            <span class="text">
                A newer version of the viewer is running.
                {{ waiting ? `The reload waits while you write a message (${left}s left).` : `This page reloads in ${left}s.` }}
            </span>
            <Btn kind="primary" small @click="reload">Reload now</Btn>
            <span class="drain" :style="{animationDuration: `${RELOAD_AFTER}s`, animationPlayState: waiting ? 'paused' : 'running'}" />
        </div>
    </template>
    <template v-if="visible">
        <div class="band">
            <span class="text">
                Agent journal {{ upstream.latest }} is out — this is {{ upstream.installed }}.
                <template v-if="lines.length">
                    <span class="done">{{ lines.join(" · ") }}</span>
                </template>
            </span>
            <template v-if="!lines.length">
                <Btn kind="primary" small :disabled="running" @click="upgrade(false)">{{ running ? "Updating…" : "Update" }}</Btn>
                <Btn small :disabled="running" @click="upgrade(true)">Update and turn on auto-update</Btn>
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

.reloading {
    position: relative;
}

.drain {
    position: absolute;
    left: 0;
    right: 0;
    bottom: -1px;
    height: 2px;
    background: var(--accent);
    transform-origin: left center;
    animation: drain linear forwards;
}

@keyframes drain {
    from {
        transform: scaleX(1);
    }

    to {
        transform: scaleX(0);
    }
}

.text {
    flex: 1;
    min-width: 0;
}

.done {
    color: var(--text-3);
}
</style>
