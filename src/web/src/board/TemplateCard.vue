<script setup>
import StageDot from "../kit/StageDot.vue";
import {effects, hasReview} from "./templates.js";

const props = defineProps({template: Object, chosen: Boolean, dimmed: Boolean});
const emit = defineEmits(["choose", "review"]);
</script>

<template>
    <div :class="['template', {chosen, dimmed}]" role="button" tabindex="0" @click="emit('choose')" @keydown.enter="emit('choose')">
        <span class="top">
            <span class="name">{{ template.title }}</span>
            <span :class="['check', {on: chosen}]">✓</span>
        </span>
        <span class="purpose">{{ template.purpose }}</span>
        <span class="stages">
            <template v-for="[stage, meaning] in template.stages" :key="stage">
                <span class="stage">
                    <StageDot :meaning="meaning" />
                    {{ stage }}
                </span>
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
    box-shadow: 0 16px 40px rgba(0, 0, 0, 0.4);
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
    border-color: var(--accent);
}

.template.dimmed {
    opacity: 0.4;
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

.check {
    color: transparent;
    font-size: 11px;
}

.check.on {
    border-color: var(--accent);
    background: var(--accent);
    color: #fff;
}

.purpose {
    color: var(--text-2);
    font-size: 13px;
    line-height: 1.5;
}

.stages {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    padding-top: 2px;
}

.stage {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 22px;
    padding: 0 8px;
    border: 1px solid var(--border);
    border-radius: 6px;
    background: var(--bg);
    color: var(--text-2);
    font-size: 12px;
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
