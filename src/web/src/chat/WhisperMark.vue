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
        Reminded the agent of
        <strong>{{ named }}</strong>
        <span class="title">{{ title }}</span>
        <span class="when">{{ clock(at) }}</span>
    </button>
</template>

<style scoped>
.whisper {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    max-width: 100%;
    padding: 4px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.whisper:hover {
    color: var(--text-2);
}

.whisper strong {
    color: var(--text-2);
    font-weight: 500;
}

.title {
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}
</style>
