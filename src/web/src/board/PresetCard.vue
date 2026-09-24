<script setup>
import {computed} from "vue";

const props = defineProps({preset: {type: Object, required: true}, shortcut: {type: String, default: ""}, chosen: Boolean});
const emit = defineEmits(["choose"]);
const count = computed(() => (props.preset.stages.length ? `${props.preset.stages.length} stages` : "Empty"));
</script>

<template>
    <button type="button" :class="['preset', {chosen}]" :aria-pressed="chosen" @click="emit('choose')">
        <span class="preset-top">
            <span class="preset-name">{{ count }}</span>
            <template v-if="shortcut">
                <span class="preset-key">{{ shortcut }}</span>
            </template>
            <span class="preset-check" aria-hidden="true">✓</span>
        </span>
        <span class="preset-stages">
            <template v-if="preset.stages.length">
                <template v-for="[stage] in preset.stages" :key="stage">
                    <span class="preset-stage">{{ stage }}</span>
                </template>
            </template>
            <template v-else>
                <span class="preset-stage ghost" />
                <span class="preset-stage ghost" />
            </template>
        </span>
        <template v-if="preset.note">
            <span class="preset-note">{{ preset.note }}</span>
        </template>
    </button>
</template>

<style scoped>
.preset {
    display: flex;
    flex-direction: column;
    gap: 12px;
    min-width: 0;
    padding: 14px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition:
        border-color 0.15s,
        background 0.15s,
        transform 0.2s var(--ease),
        box-shadow 0.15s;
}

.preset:hover {
    border-color: var(--border-3);
    background: var(--hover);
    transform: translateY(-1px);
}

.preset:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}

.preset.chosen,
.preset.chosen:hover {
    border-color: var(--accent);
    background: var(--raised);
    box-shadow: 0 0 0 1px var(--accent);
    transform: none;
}

.preset-top {
    display: flex;
    align-items: center;
    gap: 8px;
}

.preset-name {
    flex: 1;
    font-weight: 500;
}

.preset-key {
    color: var(--text-4);
    font-family: var(--mono);
    font-size: 11px;
}

.preset-check {
    display: grid;
    place-items: center;
    width: 18px;
    height: 18px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
    color: transparent;
    font-size: 11px;
    transition:
        background 0.15s,
        border-color 0.15s,
        color 0.15s;
}

.preset.chosen .preset-check {
    border-color: var(--accent);
    background: var(--accent);
    color: var(--text);
}

.preset-stages {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.preset-stage {
    display: flex;
    align-items: center;
    height: 28px;
    padding: 0 10px;
    overflow: hidden;
    border: 1px solid var(--border);
    border-radius: 7px;
    background: var(--bg);
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.preset-stage.ghost {
    border-style: dashed;
    background: none;
}

.preset-note {
    margin-top: auto;
    color: var(--text-3);
    font-size: 12px;
    line-height: 1.45;
}

@media (prefers-reduced-motion: reduce) {
    .preset,
    .preset-check {
        transition: none;
    }
}
</style>
