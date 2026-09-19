<script setup>
import {computed, ref} from "vue";
import {act} from "../api.js";
import Btn from "../kit/Btn.vue";
import CommentToggle from "./CommentToggle.vue";
import Icon from "../kit/Icon.vue";
import {peek, route} from "../route.js";
import {rows} from "../store.js";
import Markdown from "./Markdown.vue";

const props = defineProps({resource: Object});
const emit = defineEmits(["close"]);
const error = ref("");
const status = computed(() => props.resource.data.status);
const current = computed(() => props.resource.data.current || 1);
const phases = computed(() =>
    props.resource.data.phases.map((p, i) => ({
        ...p,
        i: i + 1,
        rows: p.todos.map((n) => rows("todo").find((t) => t.n === n)).filter(Boolean),
    }))
);
const done = (p) => p.rows.length > 0 && p.rows.every((t) => t.completed);
const button = computed(
    () =>
        ({
            draft: ["activate", "Start"],
            ready: ["activate", "Start"],
            waiting: ["continue", "Continue"],
            done: ["acknowledge", "Acknowledge"],
        })[status.value] || null
);

async function run(action, body = {}) {
    error.value = "";
    try {
        await act(route.value.env, "plan", props.resource.n, action, body);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <article class="body plan">
        <header class="top">
            <span class="kind">
                <Icon name="flag" :size="13" />
                Plan {{ resource.n }}
            </span>
            <span :class="['status', status]">
                {{ status }}
                <template v-if="status === 'active' || status === 'waiting'">· phase {{ current }} of {{ phases.length }}</template>
            </span>
            <span class="grow" />
            <CommentToggle />
            <Btn kind="icon" @click="emit('close')"><Icon name="x" /></Btn>
        </header>
        <h2 class="title">{{ resource.title }}</h2>
        <template v-if="resource.data.goal">
            <Markdown class="goal" :text="resource.data.goal" />
        </template>
        <div class="actions">
            <template v-if="button">
                <Btn kind="primary" @click="run(button[0])">{{ button[1] }}</Btn>
            </template>
            <template v-else-if="status === 'building'">
                <Btn kind="primary" disabled>Start</Btn>
                <span class="note">The agent is still writing this plan. It can be started once it is ready.</span>
            </template>
            <template v-if="!['done', 'abandoned'].includes(status)">
                <Btn kind="danger" @click="run('abandon', {why: 'stopped from the viewer'})">Abandon</Btn>
            </template>
            <span class="error">{{ error }}</span>
        </div>
        <template v-if="resource.brief">
            <Markdown class="brief" :text="resource.brief" />
        </template>
        <ol class="phases">
            <template v-for="p in phases" :key="p.i">
                <li :class="['phase', {current: p.i === current && (status === 'active' || status === 'waiting'), done: done(p)}]">
                    <div class="phead">
                        <span class="mark"><Icon :name="done(p) ? 'check' : 'circle'" :size="14" /></span>
                        <span class="ptitle">{{ p.i }}. {{ p.title }}</span>
                        <template v-if="p.checkpoint">
                            <span class="cp">checkpoint</span>
                        </template>
                        <span class="progress">{{ p.rows.filter((t) => t.completed).length }}/{{ p.rows.length }}</span>
                    </div>
                    <template v-if="p.when">
                        <div class="when">complete when {{ p.when }}</div>
                    </template>
                    <template v-for="t in p.rows" :key="t.n">
                        <button type="button" :class="['row', {completed: t.completed}]" @click="peek('todo', t.n)">
                            <Icon :name="t.completed ? 'check' : 'circle'" :size="12" />
                            <span class="rn">#{{ t.n }}</span>
                            <span class="rt">{{ t.title }}</span>
                        </button>
                    </template>
                </li>
            </template>
        </ol>
    </article>
</template>

<style scoped>
.top {
    display: flex;
    align-items: center;
    gap: 12px;
    color: var(--text-3);
    font-size: 11.5px;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.kind {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--accent-text);
}
.status {
    color: var(--text-2);
}
.status.active {
    color: var(--progress);
}
.status.waiting {
    color: var(--blocking);
}
.status.building {
    color: var(--accent-text);
}
.note {
    color: var(--text-3);
    font-size: 12px;
}
.grow {
    flex: 1;
}
.title {
    margin: 10px 0 4px;
    font-size: 22px;
    font-weight: 600;
}
.goal {
    margin: 0 0 10px;
    color: var(--text-2);
}
.actions {
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 8px 0 16px;
}
.error {
    color: var(--danger);
    font-size: 12px;
}
.brief {
    margin: 0 0 20px;
    color: var(--text-2);
}
.phases {
    list-style: none;
    margin: 0;
    padding: 0;
}
.phase {
    padding: 10px 14px;
    margin-bottom: 8px;
    border: 1px solid var(--border);
    border-radius: 10px;
    background: var(--raised);
}
.phase.current {
    border-color: var(--accent);
}
.phase.done {
    opacity: 0.7;
}
.phead {
    display: flex;
    align-items: center;
    gap: 10px;
}
.mark {
    color: var(--accent-text);
    display: inline-flex;
}
.ptitle {
    flex: 1;
    font-weight: 500;
}
.cp {
    color: var(--blocking);
    font-size: 11.5px;
}
.progress {
    color: var(--text-3);
    font-size: 12px;
}
.when {
    margin: 2px 0 6px 24px;
    color: var(--text-3);
    font-size: 12.5px;
}
.row {
    display: flex;
    align-items: center;
    gap: 8px;
    width: 100%;
    padding: 4px 0 4px 24px;
    border: 0;
    background: none;
    color: var(--text-2);
    text-align: left;
    cursor: pointer;
}
.row:hover {
    color: var(--text);
}
.row.completed .rt {
    text-decoration: line-through;
    color: var(--text-3);
}
.rn {
    color: var(--text-3);
    font-size: 12px;
}
</style>
