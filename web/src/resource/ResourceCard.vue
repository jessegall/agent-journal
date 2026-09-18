<script setup>
import Icon from "../kit/Icon.vue";
import {age, meta} from "../store.js";
defineProps({resource: Object});
</script>

<template>
    <button type="button" :class="['card', {completed: resource.completed}]">
        <span class="head">
            <Icon :name="meta(resource.type).icon" :size="14" />
            <span class="n">{{ meta(resource.type).title }} {{ resource.n }}</span>
            <span class="age">{{ age(resource.updated || resource.created) }}</span>
        </span>
        <span class="title">{{ resource.title }}</span>
        <span class="abstract">{{ resource.abstract || resource.brief.slice(0, 160) }}</span>
        <template v-if="resource.sections.length">
            <span class="parts">{{ resource.sections.length }} part{{ resource.sections.length > 1 ? "s" : "" }}</span>
        </template>
    </button>
</template>

<style scoped>
.card {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-height: 130px;
    padding: 14px 16px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
    text-align: left;
    cursor: pointer;
}
.card:hover {
    border-color: var(--border-2);
    background: var(--hover);
}
.card.completed {
    opacity: 0.6;
}
.head {
    display: flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
    font-size: 12px;
}
.n {
    color: var(--text-3);
}
.age {
    margin-left: auto;
    color: var(--text-3);
}
.title {
    font-weight: 500;
}
.abstract {
    color: var(--text-3);
    font-size: 12.5px;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
}
.parts {
    margin-top: auto;
    color: var(--text-3);
    font-size: 11.5px;
}
</style>
