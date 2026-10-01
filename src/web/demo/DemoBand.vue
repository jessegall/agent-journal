<script setup>
import Btn from "../src/kit/Btn.vue";
import {restart} from "./storage.js";

const REPOSITORY = "https://github.com/jessegall/agent-journal";
const INSTALL = `${REPOSITORY}#install`;

const open = (url) => window.open(url, "_blank", "noopener");
</script>

<template>
    <div class="demo-band">
        <span class="demo-band-text">A replay of a recorded session: the journal is real, the agent's moves are scripted. Nothing leaves your browser.</span>
        <span class="demo-band-acts">
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

.demo-band-acts {
    flex: none;
    display: flex;
    gap: 6px;
}

@media (max-width: 640px) {
    .demo-band {
        flex-wrap: wrap;
        justify-content: center;
        gap: 4px 12px;
    }

    .demo-band-text {
        white-space: normal;
        text-align: center;
    }
}
</style>
