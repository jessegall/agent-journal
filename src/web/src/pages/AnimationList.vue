<script setup>
import {chanceOf} from "../domain/mascots.js";
import SectionHeading from "../kit/SectionHeading.vue";

defineProps({groups: {type: Array, required: true}, chosen: {type: String, default: ""}, schedule: {type: Object, required: true}});
defineEmits(["pick"]);

const nameOf = (animation) => (animation.name ? animation.name.replace(/_/g, " ") : "default");
const idle = (groups) => (groups.find((group) => group.kind === "idle")?.items || []).map((animation) => animation.path);
</script>

<template>
    <div class="animation-list">
        <template v-for="group in groups" :key="group.kind">
            <SectionHeading>{{ group.kind }}</SectionHeading>
            <template v-for="animation in group.items" :key="animation.path">
                <button type="button" :class="['animation-list-row', {current: animation.path === chosen}]" @click="$emit('pick', animation)">
                    <span class="animation-list-name">{{ nameOf(animation) }}</span>
                    <template v-if="animation.edit">
                        <span class="animation-list-note">edited</span>
                    </template>
                    <template v-if="!animation.shipped">
                        <span class="animation-list-note">yours</span>
                    </template>
                    <template v-if="group.kind === 'idle'">
                        <span class="animation-list-chance" title="How often this one plays, of the voice's idle animations">{{ chanceOf(schedule, idle(groups), animation.path) }}%</span>
                    </template>
                </button>
            </template>
        </template>
    </div>
</template>

<style scoped>
.animation-list {
    display: flex;
    flex-direction: column;
    gap: 2px;
}

.animation-list-row {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 7px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.animation-list-row:hover,
.animation-list-row.current {
    background: color-mix(in srgb, var(--text) 8%, transparent);
}

.animation-list-row.current {
    box-shadow: inset 2px 0 0 var(--accent);
}

.animation-list-name {
    flex: 1;
    min-width: 0;
}

.animation-list-note,
.animation-list-chance {
    color: var(--text-3);
    font-size: 11px;
}
</style>
