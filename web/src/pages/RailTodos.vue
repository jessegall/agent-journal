<script setup>
import {computed} from "vue";
import Dot from "../kit/Dot.vue";
import Icon from "../kit/Icon.vue";
import PriorityIcon from "../kit/PriorityIcon.vue";
import {peek, route} from "../route.js";
import {open, rows} from "../store.js";

const groups = computed(() => {
    const named = {started: "In progress", blocked: "Blocked", asked: "Waiting on you", open: "Open"};
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
    return Object.keys(named)
        .filter((key) => buckets[key])
        .map((key) => ({key, label: named[key], rows: buckets[key]}));
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
                <button type="button" :class="['rail-row', {sel: route.page === 'todo' && route.n === t.n}]" @click="peek('todo', t.n)">
                    <span class="rail-row-marks">
                        <Dot :kind="g.key" />
                        <PriorityIcon :value="Number(t.data.priority ?? 100)" />
                        <span class="rail-row-n">#{{ t.n }}</span>
                    </span>
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
    flex-direction: column;
    align-items: flex-start;
    gap: 3px;
    width: 100%;
    min-height: 36px;
    padding: 7px var(--rail-gutter);
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
.rail-row-marks {
    display: flex;
    align-items: center;
    gap: 7px;
}

.rail-row-title {
    white-space: normal;
    line-height: 1.35;
}
</style>
