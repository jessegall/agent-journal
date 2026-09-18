<script setup>
import {computed} from "vue";
import Icon from "../kit/Icon.vue";
import {go, route} from "../route.js";
import {open, rows} from "../store.js";

const COLOR = {started: "#5b8def", asked: "#a78bfa", blocked: "#d9a441", open: "#8b8e96"};
const groups = computed(() => {
    const named = {started: "In progress", asked: "Waiting on you", blocked: "Blocked", open: "Open"};
    const of = (r) =>
        r.data.blocked
            ? "blocked"
            : r.data.status === "started"
              ? "started"
              : rows("question").some((q) => !q.completed && q.refs.includes(r.ref))
                ? "asked"
                : "open";
    const buckets = {};
    for (const r of open("todo")) (buckets[of(r)] ||= []).push(r);
    return Object.entries(buckets).map(([key, list]) => ({key, label: named[key], rows: list}));
});
</script>

<template>
    <template v-if="!groups.length">
        <div class="home-rail-empty">
            <Icon name="work" />
            <p>Nothing is on the list.</p>
        </div>
    </template>
    <div class="rail-list">
        <template v-for="g in groups" :key="g.key">
            <div class="rail-group">
                {{ g.label }}
                <span class="rail-group-n">{{ g.rows.length }}</span>
            </div>
            <template v-for="t in g.rows" :key="t.n">
                <button
                    type="button"
                    :class="['rail-row', {sel: route.page === 'todo' && route.n === t.n}]"
                    @click="go(route.env, 'todo', t.n)"
                >
                    <span class="dot" :style="{borderColor: COLOR[g.key]}" />
                    <span class="rail-row-n">#{{ t.n }}</span>
                    <span class="rail-row-title">{{ t.title }}</span>
                </button>
            </template>
        </template>
    </div>
</template>

<style scoped>
.home-rail-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 7px;
    padding: 34px 18px 0;
    text-align: center;
    color: var(--text-3);
}

.home-rail-empty p {
    margin: 0;
    font-size: 11.5px;
}

.home-rail-empty .ico {
    width: 20px;
    height: 20px;
    opacity: 0.5;
}

.rail-list {
    display: flex;
    flex-direction: column;
}

.rail-group {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 7px;
    height: 24px;
    padding: 0 var(--rail-gutter);
    border-bottom: 1px solid var(--border);
    background: var(--side);
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--text-4);
}

.rail-group-n {
    font-size: 10px;
    font-variant-numeric: tabular-nums;
    text-transform: none;
}

.rail-row {
    display: flex;
    align-items: center;
    gap: 9px;
    width: 100%;
    min-height: 36px;
    padding: 0 var(--rail-gutter);
    border: 0;
    border-bottom: 1px solid var(--border);
    background: none;
    text-align: left;
    color: var(--text-2);
    cursor: pointer;
}

.rail-row:hover {
    background: var(--hover);
}

.rail-row.sel {
    background: var(--sel);
}

.dot {
    width: 10px;
    height: 10px;
    border: 2px solid;
    border-radius: 50%;
    flex: none;
    display: inline-block;
    margin: 0 3px;
}

.rail-row-n {
    flex: none;
    font-size: 11.5px;
    color: var(--text-3);
    font-variant-numeric: tabular-nums;
}

.rail-row-title {
    flex: 1 1 auto;
    min-width: 0;
    font-size: 12.5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
</style>
