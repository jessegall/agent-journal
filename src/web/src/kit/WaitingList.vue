<script setup>
import Chip from "./Chip.vue";
import CloseButton from "./CloseButton.vue";
import {oneLine} from "../format/command.js";
import {store} from "../state/store.js";

defineProps({waiting: {type: Object, required: true}, closable: {type: Boolean, default: true}});
const emit = defineEmits(["close"]);
</script>

<template>
    <div class="waiting-list">
        <header class="waiting-head">
            <h4 class="waiting-heading">What the agent is waiting on</h4>
            <template v-if="closable">
                <CloseButton @click="emit('close')" />
            </template>
        </header>
        <ul class="waiting-items">
            <template v-for="item in waiting.items" :key="item.label">
                <li :class="['waiting-item', {back: item.reported}]">
                    <span class="waiting-label">{{ oneLine(item.label, store.summary?.project) }}</span>
                    <span class="waiting-report">{{ item.status }}</span>
                    <span class="waiting-meta">
                        <template v-if="item.kind">
                            <Chip>{{ item.kind }}</Chip>
                        </template>
                        {{ [item.where, item.out].filter(Boolean).join(" · ") }}
                    </span>
                </li>
            </template>
        </ul>
    </div>
</template>

<style scoped>
.waiting-list {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 12px 14px;
}

.waiting-head {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.waiting-heading {
    margin: 0;
    font-size: 13px;
    font-weight: 600;
}

.waiting-items {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding: 0;
    list-style: none;
}

.waiting-item {
    display: grid;
    grid-template-columns: 1fr auto;
    gap: 2px 10px;
    font-size: 13px;
}

.waiting-meta {
    grid-column: 1;
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
    font-size: 12px;
}

.waiting-report {
    grid-row: 1;
    grid-column: 2;
    color: var(--accent-text);
    font-size: 12px;
}

.waiting-item.back .waiting-report {
    color: var(--tone-good);
}
</style>
