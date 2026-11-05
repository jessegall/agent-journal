<script setup>
import {computed} from "vue";
import {peekRef} from "../src/route.js";
import Skeleton from "../src/kit/Skeleton.vue";

// the agents of one role, as a dropdown lists them, the running ones first; each opens its panel
const props = defineProps({rows: {type: Array, required: true}, loaded: Boolean, failure: {type: String, default: ""}, none: {type: String, required: true}});
const ordered = computed(() => [...props.rows].sort((one, two) => Boolean(one.ended_at) - Boolean(two.ended_at) || two.id - one.id));
const runningCount = computed(() => props.rows.filter((row) => !row.ended_at).length);
</script>

<template>
    <div class="agent-rows" data-agent-rows>
        <template v-if="!loaded">
            <Skeleton shape="text" />
        </template>
        <template v-else-if="failure">
            <p class="agent-rows-note">{{ failure }}</p>
        </template>
        <template v-else-if="!rows.length">
            <p class="agent-rows-note">{{ none }}</p>
        </template>
        <template v-else>
            <p class="agent-rows-note" data-agent-rows-count>{{ runningCount }} running</p>
            <template v-for="row in ordered" :key="row.id">
                <button type="button" class="agent-row" :data-agent-row="row.id" @click="peekRef(`agents:${row.id}`)">
                    <span class="agent-row-name">#{{ row.id }} {{ row.session }}</span>
                    <span class="agent-row-state">{{ row.ended_at ? "Closed" : "Running" }}</span>
                </button>
            </template>
        </template>
    </div>
</template>

<style scoped>
.agent-rows {
    display: flex;
    flex-direction: column;
    gap: 2px;
    min-width: 260px;
    max-height: 360px;
    overflow: auto;
}

.agent-rows-note {
    margin: 0 0 4px;
    color: var(--text-3);
    font-size: 12px;
}

.agent-row {
    display: flex;
    gap: 10px;
    justify-content: space-between;
    padding: 5px 6px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 13px;
    text-align: left;
    cursor: pointer;
}

.agent-row:hover {
    background: var(--hover);
}

.agent-row-name {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.agent-row-state {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}
</style>
