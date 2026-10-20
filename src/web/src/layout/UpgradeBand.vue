<script setup>
import {onPhone} from "../platform/phone.js";
import {fieldBusy, reloadWhenFree} from "../platform/busyField.js";
import {remember, remembered} from "../platform/storage.js";
import {saveSettings} from "../actions/settings.js";
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import {store} from "../state/store.js";
import {useNow} from "../composables/now.js";
import {runUpdate} from "../composables/updates.js";
import {clear, updating} from "../state/updating.js";

const upstream = ref(null);
const dismissed = ref(remembered("journal.upgrade.dismissed", ""));
const lines = ref([]);
const running = ref(false);
// the phone neither installs updates nor needs telling of a new build: its service worker brings the newest page on each open
const visible = computed(() => !onPhone && upstream.value && upstream.value.newer && dismissed.value !== upstream.value.latest);
const mine = (document.querySelector("script[type=module]") || {}).src || "";
const stale = computed(() => {
    const serving = store.spec && store.spec.build;
    return !onPhone && !!serving && !!mine && !mine.endsWith(serving);
});

const RELOAD_AFTER = 60;
const now = useNow();
const remaining = ref(0);
const waiting = computed(() => store.drafting > 0 || fieldBusy());
const left = computed(() => Math.ceil(remaining.value));

watch(stale, (is) => (remaining.value = is ? RELOAD_AFTER : 0), {immediate: true});
watch(now, (at, before) => {
    if (!remaining.value || waiting.value) return;
    remaining.value = Math.max(0, remaining.value - (at - before));
    if (!remaining.value) reload();
});

// the phone shows no band, so it never asks
onMounted(async () => {
    if (onPhone) return;
    try {
        upstream.value = await api.releases();
    } catch (e) {}
});

function reload() {
    reloadWhenFree(window);
}

function dismiss() {
    dismissed.value = upstream.value.latest;
    remember("journal.upgrade.dismissed", dismissed.value);
}

async function upgrade(always = false) {
    running.value = true;
    lines.value = [];
    try {
        if (always) await saveSettings({updates: {auto: true}});
    } catch (e) {
        lines.value = [e.message];
        running.value = false;
        return;
    }
    await runUpdate(upstream.value.latest);
    running.value = false;
}

async function retry() {
    const version = updating.version;
    clear();
    running.value = true;
    await runUpdate(version);
    running.value = false;
}
</script>

<template>
    <template v-if="store.offline">
        <div class="band offline" role="status">
            <span class="text">
                The journal's server is not answering, so this page may be out of date. It catches up by itself once the server is back.
            </span>
        </div>
    </template>
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
    <template v-if="updating.failure">
        <div class="band failed" role="alert">
            <span class="text">The update to {{ updating.version }} did not finish: {{ updating.failure }}</span>
            <Btn kind="primary" small @click="retry">Try again</Btn>
        </div>
    </template>
    <template v-if="upstream && upstream.problem">
        <div class="band failed" role="alert">
            <span class="text">The last update did not finish: {{ upstream.problem }}</span>
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
                <Btn kind="primary" small :busy="running" @click="upgrade(false)">Update now</Btn>
                <Btn small :class="{dimmed: running}" :disabled="running" @click="upgrade(true)">Update now and install new releases on its own</Btn>
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

.failed {
    border-bottom-color: color-mix(in srgb, var(--danger) 45%, var(--border));
    background: color-mix(in srgb, var(--danger) 12%, var(--bg));
}

.dimmed {
    opacity: 0.5;
}

.offline {
    border-bottom-color: color-mix(in srgb, var(--danger, #d9534f) 45%, var(--border));
    background: color-mix(in srgb, var(--danger, #d9534f) 12%, var(--bg));
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
