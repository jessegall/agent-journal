<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {clock} from "../format/time.js";
import {peek} from "../route.js";
import {meta} from "../state/store.js";

const props = defineProps({
    row: {type: String, required: true},
    title: {type: String, required: true},
    at: {type: Number, required: true},
});

const type = computed(() => props.row.split(":")[0]);
const n = computed(() => Number(props.row.split(":")[1]));
const named = computed(() => `${(meta(type.value) || {title: type.value}).title.toLowerCase()} ${n.value}`);
</script>

<template>
    <button type="button" class="whisper" :title="`Open ${named}`" @click="peek(type, n)">
        <Icon name="book" :size="12" />
        <span class="head">
            Reminded the agent of
            <strong>{{ named }}</strong>
            <span class="when">{{ clock(at) }}</span>
        </span>
        <span class="title">{{ title }}</span>
    </button>
</template>

<style scoped>
.whisper {
    display: inline-grid;
    grid-template-columns: auto minmax(0, 1fr);
    column-gap: 7px;
    row-gap: 1px;
    align-items: center;
    max-width: 100%;
    padding: 5px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    text-align: left;
    cursor: pointer;
}

.whisper:hover {
    color: var(--text-2);
}

.head {
    display: flex;
    gap: 6px;
    white-space: nowrap;
}

.head strong {
    color: var(--text-2);
    font-weight: 500;
}

.title {
    grid-column: 2;
    overflow: hidden;
    color: var(--text-3);
    font-size: 11px;
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
