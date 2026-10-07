<script setup>
import {span} from "../format/time.js";
import {useNow} from "../composables/now.js";
import CloseButton from "./CloseButton.vue";

const props = defineProps({waiting: {type: Object, required: true}, closable: {type: Boolean, default: true}});
const emit = defineEmits(["close"]);
const now = useNow(30000);
const out = (item) => {
    const since = item.since || props.waiting.since;
    return since ? span(now.value - since) : "";
};
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
                    <span class="waiting-label">{{ item.label }}</span>
                    <span class="waiting-meta">
                        {{ [item.where, out(item)].filter(Boolean).join(" · ") }}
                    </span>
                    <span class="waiting-report">{{ item.reported ? "Report is in" : "At work" }}</span>
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
    color: var(--text-3);
    font-size: 12px;
}

.waiting-report {
    grid-row: 1 / span 2;
    grid-column: 2;
    align-self: center;
    color: var(--accent-text);
    font-size: 12px;
}

.waiting-item.back .waiting-report {
    color: var(--tone-good);
}
</style>
