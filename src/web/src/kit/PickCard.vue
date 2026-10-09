<script setup>
import Illustration from "./Illustration.vue";

defineProps({title: {type: String, required: true}, picked: Boolean, note: {type: String, default: ""}, art: {type: String, default: ""}});
</script>

<template>
    <button type="button" role="radio" :aria-checked="picked" :class="['pick-card', {picked}]">
        <Illustration :src="art" :size="72" />
        <span class="pick-card-head">
            <span class="pick-card-dot" />
            {{ title }}
        </span>
        <span class="pick-card-body"><slot /></span>
        <template v-if="note">
            <span class="pick-card-note">{{ note }}</span>
        </template>
    </button>
</template>

<style scoped>
.pick-card {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 12px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--bg);
    color: var(--text);
    font: inherit;
    text-align: left;
    cursor: pointer;
}

.pick-card:hover {
    border-color: var(--text-4);
}

.pick-card.picked {
    border-color: var(--accent);
    background: var(--raised);
}

.pick-card-head {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
}

.pick-card-dot {
    width: 12px;
    height: 12px;
    border: 1.5px solid var(--text-4);
    border-radius: 50%;
}

.picked .pick-card-dot {
    border: 4px solid var(--accent);
}

.pick-card-body {
    flex: 1;
    padding: 8px 10px;
    border-radius: 8px;
    background: var(--border);
    color: var(--text-2);
    font-size: 12.5px;
    line-height: 1.5;
}

.pick-card-note {
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
