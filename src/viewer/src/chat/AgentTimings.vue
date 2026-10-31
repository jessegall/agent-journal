<script setup>
import {ref} from "vue";
import Icon from "../kit/Icon.vue";
import MenuItem from "../kit/MenuItem.vue";
import MenuPanel from "../kit/MenuPanel.vue";
import MenuSlide from "../kit/MenuSlide.vue";
import AgentFact from "./AgentFact.vue";

defineProps({
    icon: {type: String, required: true},
    title: {type: String, required: true},
    heading: {type: String, required: true},
    average: {type: Number, required: true},
    unit: {type: String, default: "ms"},
    parts: {type: Array, default: () => []},
});
const LEAVE_MS = 250;
const WIDTH = 340;
const LIST = {maxHeight: "min(420px, 60vh)", overflowY: "auto"};
const button = ref(null);
const shown = ref(false);
const pinned = ref(false);
const drilled = ref(null);
let leaving = 0;
const enter = () => (clearTimeout(leaving), (shown.value = true));
const leave = () => (clearTimeout(leaving), (leaving = setTimeout(() => !pinned.value && !drilled.value && close(), LEAVE_MS)));
const toggle = () => (pinned.value = !pinned.value) || (shown.value = false);
const close = () => (pinned.value = shown.value = false) || (drilled.value = null);
</script>

<template>
    <span ref="button" class="agent-timings" @mouseenter="enter" @mouseleave="leave">
        <AgentFact :class="['agent-fact', 'agent-count', {open: shown}]" :icon="icon" :title="title" :aria-expanded="shown" @click="toggle">{{ average }} {{ unit }}</AgentFact>
        <template v-if="shown">
            <MenuPanel :anchor="button" :min-width="WIDTH" :max-width="WIDTH" :style="{width: `${WIDTH}px`}" @click.stop @close="close" @mouseenter="enter" @mouseleave="leave">
                <MenuSlide :second="Boolean(drilled)">
                    <template #first>
                        <p class="timings-head">{{ heading }}, highest first</p>
                        <div class="timings-rows" :style="LIST">
                            <template v-for="part in parts" :key="part.name">
                                <MenuItem class="timings-row" @click="drilled = part">
                                    <span class="timings-name">{{ part.name }}</span>
                                    <b>{{ part.average }} {{ unit }}</b>
                                    <small>{{ part.count }} timed</small>
                                    <Icon name="chevronRight" :size="12" />
                                </MenuItem>
                            </template>
                            <template v-if="!parts.length">
                                <p class="timings-none">Nothing counted yet</p>
                            </template>
                        </div>
                    </template>
                    <template #second>
                        <MenuItem class="timings-back" @click="drilled = null">
                            <Icon name="back" :size="14" />
                            {{ drilled?.name }}
                        </MenuItem>
                        <div class="timings-rows" :style="LIST">
                            <template v-for="detail in drilled?.details || []" :key="detail.label">
                                <div class="timings-detail">
                                    <span class="timings-name">{{ detail.label }}</span>
                                    <b>{{ detail.text }}</b>
                                </div>
                            </template>
                        </div>
                    </template>
                </MenuSlide>
            </MenuPanel>
        </template>
    </span>
</template>

<style scoped>
.agent-timings {
    display: inline-flex;
}

.timings-head {
    margin: 0;
    padding: 6px 8px 2px;
    color: var(--text-3);
    font-size: 11px;
}

.timings-rows .timings-row {
    box-sizing: border-box;
    width: 100%;
    display: grid;
    grid-template-columns: minmax(0, 1fr) 76px 76px 14px;
    align-items: baseline;
    gap: 8px;
}

.timings-rows .timings-row b,
.timings-rows .timings-row small {
    text-align: right;
    white-space: nowrap;
}

.timings-row :deep(.ico) {
    align-self: center;
}

.timings-name {
    flex: 1 1 auto;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.timings-back {
    color: var(--text-3);
}

.timings-row small,
.timings-none {
    color: var(--text-3);
}

.timings-none {
    margin: 0;
    padding: 6px 8px;
}

.timings-detail {
    display: flex;
    align-items: baseline;
    gap: 8px;
    padding: 4px 8px;
    font-size: 12px;
}
</style>
