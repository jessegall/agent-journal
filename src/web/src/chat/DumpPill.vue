<script setup>
import {PHASE_WORDS} from "../domain/dumpPile.js";

defineProps({phase: {type: String, required: true}});

const TONES = {
    removed: "idle",
    stopped: "idle",
    done: "done",
    queued: "idle",
    asking: "needs",
    quiet: "needs",
    filing: "live",
    waiting: "live",
};
</script>

<template>
    <span :class="['dump-pill', TONES[phase]]">{{ PHASE_WORDS[phase] }}</span>
</template>

<style scoped>
.dump-pill {
    flex: none;
    height: 20px;
    padding: 0 8px;
    border-radius: 10px;
    background: var(--sel);
    font-size: 11px;
    line-height: 20px;
    color: var(--text-2);
}

.dump-pill.live {
    background: var(--accent-dim);
    color: var(--accent-text);
}

.dump-pill.done {
    background: color-mix(in srgb, var(--tone-good) 14%, transparent);
    color: var(--tone-good);
}

.dump-pill.needs {
    background: color-mix(in srgb, var(--tone-warn) 14%, transparent);
    color: var(--tone-warn);
}
</style>
