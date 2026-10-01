<script setup>
import Btn from "../src/kit/Btn.vue";
import Segmented from "../src/kit/Segmented.vue";
import {SHORT, play, scenario} from "./scenarios.js";
import {restart} from "./storage.js";
import {viewAs} from "./view.js";
</script>

<template>
    <div class="phone-band" title="A scripted replay of a recorded session. Nothing leaves your phone.">
        <span class="phone-band-word">Replay</span>
        <Segmented class="phone-band-scenarios" :options="SHORT" :value="scenario.key" @pick="play" />
        <Btn small title="Start the replay again" @click="restart">Restart</Btn>
        <Btn small @click="viewAs('desktop')">Desktop</Btn>
    </div>
</template>

<style>
:root {
    --demo-band: calc(env(safe-area-inset-top) + 40px);
}

.phone {
    top: var(--demo-band) !important;
    height: calc(100dvh - var(--demo-band)) !important;
}
</style>

<style scoped>
.phone-band {
    position: fixed;
    top: 0;
    right: 0;
    left: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    gap: 8px;
    height: var(--demo-band);
    padding: env(safe-area-inset-top) 10px 0;
    background: var(--accent-dim);
    color: var(--accent-text);
    font-size: 12px;
}

.phone-band-word {
    flex: none;
    font-weight: 600;
}

.phone-band-scenarios {
    flex: 1;
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: none;
}
</style>
