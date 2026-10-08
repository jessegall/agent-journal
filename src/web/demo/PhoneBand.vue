<script setup>
import Btn from "../src/kit/Btn.vue";
import LessonEnd from "./LessonEnd.vue";
import LessonStatus from "./LessonStatus.vue";
import {lessons, scenario} from "./scenarios.js";
import {restart} from "./storage.js";
import {viewAs} from "./view.js";

const {player} = globalThis.demo;
</script>

<template>
    <div class="phone-band" title="A recorded session where you play the user. Nothing leaves your phone.">
        <span class="phone-band-lesson">{{ scenario.title }}</span>
        <Btn small @click="lessons">Lessons</Btn>
        <Btn small title="Start the replay again" @click="restart">Restart</Btn>
        <Btn small @click="viewAs('desktop')">Desktop</Btn>
        <LessonStatus :player="player" class="phone-band-status" />
        <LessonEnd :player="player" />
    </div>
</template>

<style>
:root {
    --demo-band: calc(env(safe-area-inset-top) + 68px);
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
    flex-wrap: wrap;
    align-content: center;
    align-items: center;
    gap: 4px 8px;
    height: var(--demo-band);
    padding: env(safe-area-inset-top) 10px 0;
    background: var(--accent-dim);
    color: var(--accent-text);
    font-size: 12px;
}

.phone-band-status {
    flex-basis: 100%;
}

.phone-band-lesson {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
