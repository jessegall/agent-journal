<script setup>
import {onMounted, ref} from "vue";
import {phone} from "../api/phone.js";
import TextDisplay from "../kit/TextDisplay.vue";

const props = defineProps({plan: {type: Object, required: true}});
const PHASE_WORDS = {done: "Done", now: "Now", next: "Next"};
const ACTIVE = ["approved", "active", "waiting"];

function phaseState(i) {
    if (props.plan.type !== "plan") return "";
    if (props.plan.completed || props.plan.data.status === "done") return "done";
    if (!ACTIVE.includes(props.plan.data.status)) return "";
    const current = props.plan.data.current || 1;
    if (i + 1 < current) return "done";
    return i + 1 === current ? "now" : "next";
}

const titles = ref({});

async function named(n) {
    const row = await phone.row(`todo:${n}`).catch(() => null);
    if (row) titles.value = {...titles.value, [n]: {title: row.title, done: !!row.completed}};
}

onMounted(() => (props.plan.data.phases || []).flatMap((phase) => phase.todos || []).forEach(named));
</script>

<template>
    <template v-for="(phase, i) in plan.data.phases || []" :key="phase.title">
        <details :class="['reader-phase', phaseState(i)]">
            <summary>
                {{ i + 1 }}. {{ phase.title }}
                <template v-if="phaseState(i)">
                    <span :class="['reader-phase-state', phaseState(i)]">{{ PHASE_WORDS[phaseState(i)] }}</span>
                </template>
            </summary>
            <p>Done when: {{ phase.when }}</p>
            <template v-if="phase.brief">
                <TextDisplay :text="phase.brief" />
            </template>
            <template v-if="(phase.todos || []).length">
                <ul class="reader-phase-todos">
                    <template v-for="n in phase.todos" :key="n">
                        <li :class="{done: titles[n]?.done}">
                            <a href="#" :data-peek="`todo:${n}`">{{ titles[n]?.title || `to-do ${n}` }}</a>
                        </li>
                    </template>
                </ul>
            </template>
        </details>
    </template>
</template>

<style scoped>
.reader-phase {
    margin: 10px 0;
    padding: 12px 16px;
    border-radius: 12px;
    background: var(--raised);
}

.reader-phase summary {
    min-height: 32px;
    font-weight: 600;
}

.reader-phase-todos {
    margin: 8px 0 0;
    padding-left: 20px;
}

.reader-phase-todos li {
    padding: 4px 0;
}

.reader-phase-todos li.done {
    color: var(--text-3);
    text-decoration: line-through;
}

.reader-phase-todos a {
    color: var(--accent-text);
    text-decoration: none;
}

.reader-phase-state {
    margin-left: 8px;
    padding: 1px 8px;
    border-radius: 9px;
    background: var(--hover);
    color: var(--text-2);
    font-size: 0.706rem;
    font-weight: 600;
    vertical-align: middle;
}

.reader-phase-state.done {
    background: color-mix(in oklab, var(--tone-good) 18%, transparent);
    color: var(--text);
}

.reader-phase-state.now {
    background: var(--accent);
    color: #fff;
}

.reader-phase.now {
    box-shadow: inset 3px 0 0 var(--accent);
}
</style>
