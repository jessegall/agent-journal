<script setup>
import Dot from "../kit/Dot.vue";
import Icon from "../kit/Icon.vue";
import {age, meta} from "../store.js";
defineProps({resource: Object, selected: Boolean});

const state = (r) => (r.completed ? "done" : r.data.blocked ? "blocked" : r.data.status === "started" ? "started" : "open");
</script>

<template>
    <button type="button" :class="['row', {selected, completed: resource.completed}]">
        <span class="glyph">
            <template v-if="meta(resource.type).counted">
                <Dot :kind="state(resource)" />
            </template>
            <template v-else>
                <Icon :name="meta(resource.type).icon" :size="14" />
            </template>
        </span>
        <span class="n">#{{ resource.n }}</span>
        <span class="text">
            <span class="title">{{ resource.title }}</span>
            <template v-if="resource.abstract || resource.brief">
                <span class="abstract">
                    {{ resource.abstract || resource.brief.split("\n")[0] }}
                </span>
            </template>
        </span>
        <span class="age">{{ age(resource.updated || resource.created) }}</span>
    </button>
</template>

<style scoped>
.row {
    display: flex;
    align-items: center;
    gap: 12px;
    width: 100%;
    padding: 9px 22px;
    border: 0;
    border-top: 1px solid var(--border);
    background: none;
    text-align: left;
    cursor: pointer;
}
.row:hover {
    background: var(--hover);
}
.row.selected {
    background: var(--sel);
}
.row.completed .title {
    color: var(--text-3);
    text-decoration: line-through;
}
.glyph {
    color: var(--accent-text);
    display: inline-flex;
}
.n {
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
    width: 36px;
}
.text {
    flex: 1;
    min-width: 0;
    display: flex;
    flex-direction: column;
}
.title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}
.abstract {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: var(--text-3);
    font-size: 12.5px;
}
.age {
    color: var(--text-3);
    font-size: 12px;
}
</style>
