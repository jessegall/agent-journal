<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {effects, hasReview} from "./templates.js";

const props = defineProps({template: Object, chosen: Boolean, dimmed: Boolean});
const emit = defineEmits(["choose", "review"]);
const line = computed(() => props.template.stages.map(([stage]) => stage));
</script>

<template>
    <div :class="['template', {chosen, dimmed}]" role="button" tabindex="0" @click="emit('choose')" @keydown.enter="emit('choose')">
        <span class="top">
            <span class="name">{{ template.title }}</span>
            <span :class="['check', {on: chosen}]">
                <template v-if="chosen">
                    <Icon name="check" />
                </template>
            </span>
        </span>
        <span class="purpose">{{ template.purpose }}</span>
        <span class="stages">
            <template v-for="(stage, i) in line" :key="stage">
                <template v-if="i">
                    <span class="arrow">→</span>
                </template>
                {{ stage }}
            </template>
        </span>
        <span class="effects">{{ effects(template).join(" · ") }}</span>
        <template v-if="!hasReview(template)">
            <span class="unreviewed">
                No review stage: an agent's work is not checked before it is done.
                <button type="button" class="add-review" @click.stop="emit('review')">Add a Review stage</button>
            </span>
        </template>
    </div>
</template>

<style scoped>
.template {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 16px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    cursor: pointer;
    animation: rise 0.45s cubic-bezier(0.2, 0.9, 0.25, 1) both;
    transition:
        border-color 0.15s,
        background 0.15s,
        opacity 0.2s;
}

.template:hover {
    border-color: var(--border-3);
}

.template.chosen {
    border-color: var(--border-3);
    background: var(--sel);
}

.template.dimmed {
    opacity: 0.5;
}

.top {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.name {
    font-size: 14px;
    font-weight: 500;
}

.check {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
}

.check.on {
    border-color: var(--text);
    background: var(--text);
    color: var(--bg);
}

.purpose {
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.stages {
    color: var(--text-3);
    font-size: 12px;
}

.arrow {
    margin: 0 4px;
    color: var(--text-4);
}

.effects,
.unreviewed {
    color: var(--text-4);
    font-size: 12px;
    line-height: 1.5;
}

.add-review {
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-decoration: underline;
    cursor: pointer;
}

.add-review:hover {
    color: var(--text);
}

@keyframes rise {
    from {
        opacity: 0;
        transform: translateY(12px);
    }
}
</style>
