<script setup>
import {remember, remembered} from "../platform/storage.js";
import {saveSettings} from "../actions/settings.js";
import {computed, onMounted, ref, watch} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Notice from "../kit/Notice.vue";
import {store} from "../state/store.js";
import {useNow} from "../composables/now.js";
import {hostedOn} from "../composables/settings.js";
import {runUpdate} from "../composables/updates.js";
import {clear, updating} from "../state/updating.js";

const upstream = ref(null);
const dismissed = ref(remembered("journal.upgrade.dismissed", ""));
const lines = ref([]);
const running = ref(false);
const visible = computed(
    () => !hostedOn.value && upstream.value && upstream.value.newer && (!upstream.value.installs || upstream.value.changed?.length) && dismissed.value !== upstream.value.latest
);
const changed = computed(() => upstream.value?.changed || []);
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

async function upgrade(always = false, yes = false) {
    running.value = true;
    lines.value = [];
    try {
        if (always) await saveSettings({features: {auto_update: true}});
    } catch (e) {
        lines.value = [e.message];
        running.value = false;
        return;
    }
    await runUpdate(upstream.value.latest, yes);
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
    <template v-if="visible && changed.length">
        <Notice tone="need" class="changed-files">
            These files changed since the journal wrote them: {{ changed.join(", ") }}. Updating will copy them into .journal/attic before replacing them.
            <template v-if="lines.length">
                <span>{{ lines.join(" · ") }}</span>
            </template>
            <template #actions>
                <Btn small @click="dismiss">Keep your changes</Btn>
                <Btn kind="primary" small :disabled="running" @click="upgrade(false, true)">Update anyway</Btn>
            </template>
        </Notice>
    </template>
    <template v-else-if="visible">
        <div class="band">
            <span class="text">
                Agent journal {{ upstream.latest }} is out — this is {{ upstream.installed }}.
                <template v-if="lines.length">
                    <span class="done">{{ lines.join(" · ") }}</span>
                </template>
            </span>
            <template v-if="!lines.length">
                <Btn kind="primary" small :busy="running" @click="upgrade(false)">Update</Btn>
                <Btn small :class="{dimmed: running}" :disabled="running" @click="upgrade(true)">Update and turn on auto-update</Btn>
            </template>
            <Btn small @click="dismiss">Not now</Btn>
        </div>
    </template>
</template>

<style scoped>
.changed-files {
    margin: 6px 12px;
}
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
