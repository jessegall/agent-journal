<script setup>
import {ref} from "vue";
import SwitchCase from "../kit/SwitchCase.vue";
import ActivityEvents from "./ActivityEvents.vue";
import ActivityFiles from "./ActivityFiles.vue";

const TABS = [
    ["events", "Activity"],
    ["files", "Files"],
];
const tab = ref("events");
</script>

<template>
    <aside class="activity-dock">
        <div class="activity-panel">
            <div class="activity-head" role="tablist">
                <template v-for="[name, label] in TABS" :key="name">
                    <button
                        type="button"
                        role="tab"
                        :aria-selected="tab === name"
                        :class="['activity-tab', {on: tab === name}]"
                        @click="tab = name"
                    >
                        {{ label }}
                    </button>
                </template>
            </div>
            <SwitchCase :value="tab">
                <template #files><ActivityFiles /></template>
                <template #default><ActivityEvents /></template>
            </SwitchCase>
        </div>
    </aside>
</template>

<style scoped>
.activity-dock {
    width: 290px;
    flex: none;
    min-height: 0;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    padding: 0 10px;
    background: var(--side);
    border-left: 1px solid var(--border);
}

.activity-panel {
    display: flex;
    flex-direction: column;
    flex: 1;
    min-height: 0;
}

.activity-head {
    height: 48px;
    flex: none;
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: 14px;
    margin: 0 -10px;
    padding: 0 18px;
    border-bottom: 1px solid var(--border);
}

.activity-tab {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0;
    border: 0;
    background: none;
    font-size: 11.5px;
    letter-spacing: 0.03em;
    color: var(--text-3);
    white-space: nowrap;
    cursor: pointer;
}

.activity-tab:hover {
    color: var(--text-2);
}

.activity-tab.on {
    color: var(--text);
    box-shadow: inset 0 -1px 0 var(--accent);
}
</style>
