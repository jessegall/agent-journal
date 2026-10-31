<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import SidePanel from "../kit/SidePanel.vue";
import DeveloperNudges from "./DeveloperNudges.vue";
import DeveloperNumbers from "./DeveloperNumbers.vue";
import DeveloperReaders from "./DeveloperReaders.vue";

// The Developer tab's numbers, the timings of hooks and requests, the newest and slowest requests, the records read, the nudge
// counts and how well the shell readers read, opened from one button into a side inspector instead of filling the page; read only while it is open
const opened = ref(false);
</script>

<template>
    <section class="developer-panel">
        <p class="developer-panel-line">The timings of hooks and requests, the newest and slowest requests, the records they read and the nudge counts.</p>
        <Btn small @click="opened = true">Open the developer numbers</Btn>
        <template v-if="opened">
            <SidePanel title="Developer numbers" width="page" @close="opened = false">
                <DeveloperNumbers />
                <DeveloperNudges />
                <DeveloperReaders />
            </SidePanel>
        </template>
    </section>
</template>

<style scoped>
.developer-panel {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
    margin: 0 0 24px;
}

.developer-panel-line {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
