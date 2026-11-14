<script setup>
import {computed} from "vue";
import Btn from "../kit/Btn.vue";
import Spinner from "../kit/Spinner.vue";
import {updating} from "../state/updating.js";

// version 4's cover: the page blurred behind one centred card while the server is away; it closes by itself when the server answers
const title = computed(() => {
    if (updating.offline) return "You are offline";
    if (updating.late) return "The journal is not answering";
    return updating.external ? "Updating the journal" : "Restarting the journal";
});
const step = computed(() => {
    if (updating.offline) return "This page reconnects when your network is back";
    return updating.external ? "This can take a minute" : "This takes a few seconds";
});
const reload = () => window.location.reload();
</script>

<template>
    <template v-if="updating.starting">
        <div class="cover" role="alertdialog" aria-live="polite" aria-busy="true" :aria-label="title" data-server-cover>
            <div class="panel">
                <Spinner :size="22" class="spin" />
                <p class="title">{{ title }}</p>
                <template v-if="updating.late && !updating.offline">
                    <Btn small variant="primary" data-server-cover-reload @click="reload">Reload</Btn>
                </template>
                <template v-else>
                    <p class="step">{{ step }}</p>
                </template>
            </div>
        </div>
    </template>
</template>

<style scoped>
.cover {
    position: fixed;
    inset: 0;
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    background: color-mix(in srgb, var(--bg) 55%, transparent);
    backdrop-filter: blur(6px);
    box-shadow: inset 0 0 120px color-mix(in srgb, var(--accent) 22%, transparent);
    cursor: progress;
    touch-action: none;
}

.panel {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 6px;
    box-sizing: border-box;
    width: min(300px, calc(100vw - 32px));
    height: 150px;
    padding: 22px 28px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    box-shadow: var(--tip-shadow);
    text-align: center;
}

.spin {
    margin-bottom: 6px;
    color: var(--accent-text);
}

.title {
    margin: 0;
    color: var(--text);
    font-size: 14px;
    font-weight: 600;
}

.step {
    margin: 0;
    color: var(--text-2);
    font-size: 13px;
}
</style>
