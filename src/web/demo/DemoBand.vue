<script setup>
import Btn from "../src/kit/Btn.vue";
import {lessons, scenario} from "./scenarios.js";
import {restart} from "./storage.js";
import {insideFrame, viewAs} from "./view.js";

const REPOSITORY = "https://github.com/jessegall/agent-journal";
const INSTALL = `${REPOSITORY}#install`;
const WHOLE = "A recorded session where you play the user. Nothing leaves your browser.";

const open = (url) => window.open(url, "_blank", "noopener");
const framed = insideFrame();
</script>

<template>
    <div class="demo-band">
        <span class="demo-band-text" :title="WHOLE">
            <span class="demo-band-lesson">{{ scenario.title }}</span>
            <span class="demo-band-long">&nbsp;· {{ WHOLE }}</span>
        </span>
        <span class="demo-band-acts">
            <Btn small title="Pick another lesson" @click="lessons">All lessons</Btn>
            <template v-if="!framed">
                <Btn small class="demo-band-phone" title="Watch the demo at the size of a phone" @click="viewAs('phone')">Phone view</Btn>
            </template>
            <Btn small title="Clear what this demo kept in your browser and start again" @click="restart">Restart</Btn>
            <Btn small @click="open(INSTALL)">Install</Btn>
            <Btn small @click="open(REPOSITORY)">View on GitHub</Btn>
        </span>
    </div>
</template>

<style scoped>
.demo-band {
    flex: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 4px 12px;
    background: var(--accent-dim);
    color: var(--accent-text);
    font-size: 12px;
}

.demo-band-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.demo-band-lesson {
    font-weight: 600;
}

.demo-band-acts {
    flex: none;
    display: flex;
    gap: 6px;
}

@media (max-width: 640px) {
    .demo-band {
        flex-wrap: wrap;
        justify-content: center;
        gap: 2px 12px;
    }

    .demo-band-long,
    .demo-band-phone {
        display: none;
    }
}
</style>
