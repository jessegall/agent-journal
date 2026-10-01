<script setup>
import Btn from "../src/kit/Btn.vue";
import Segmented from "../src/kit/Segmented.vue";
import {SCENARIOS, play, scenario} from "./scenarios.js";
import {phoneAddress, viewAs} from "./view.js";
import {restart} from "./storage.js";

const address = phoneAddress();
</script>

<template>
    <div class="phone-frame-page">
        <header class="phone-frame-bar">
            <span class="phone-frame-title">The phone app</span>
            <Segmented :options="SCENARIOS" :value="scenario.key" @pick="play" />
            <Btn small title="Start the replay again" @click="restart">Restart</Btn>
            <Btn small @click="viewAs('desktop')">Desktop view</Btn>
        </header>
        <div class="phone-frame-device">
            <iframe :src="address" title="The phone app" />
        </div>
    </div>
</template>

<style scoped>
.phone-frame-page {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 16px;
    min-height: 100vh;
    padding: 20px 16px;
    background: var(--bg);
    color: var(--text-2);
}

.phone-frame-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    width: 640px;
    max-width: 100%;
    font-size: 13px;
}

.phone-frame-device {
    flex: none;
    width: 410px;
    height: min(864px, calc(100vh - 92px));
    padding: 10px;
    border-radius: 44px;
    background: #050506;
    box-shadow: 0 0 0 1px var(--border-2), 0 24px 60px rgba(0, 0, 0, 0.5);
}

.phone-frame-device iframe {
    display: block;
    width: 100%;
    height: 100%;
    border: 0;
    border-radius: 34px;
    background: var(--bg);
}
</style>
