<script setup>
import CloseButton from "../kit/CloseButton.vue";
import {computed, inject, ref, watchEffect} from "vue";
import Btn from "../kit/Btn.vue";
import CommentToggle from "./CommentToggle.vue";
import ShareButton from "./ShareButton.vue";
import SideToggle from "./SideToggle.vue";
import DownloadLink from "./DownloadLink.vue";
import Dot from "../kit/Dot.vue";
import Icon from "../kit/Icon.vue";
import {peek, peekThere, route} from "../route.js";
import {state} from "../domain/records.js";
import {useScope} from "../composables/scope.js";
import TextDisplay from "../kit/TextDisplay.vue";
import Sections from "./Sections.vue";
import Folded from "../kit/Folded.vue";
import Switch from "../kit/Switch.vue";
import PlanCritique from "./PlanCritique.vue";
import ProgressBar from "../kit/ProgressBar.vue";

const props = defineProps({resource: Object, readOnly: Boolean, pinProgress: Boolean, closable: {type: Boolean, default: true}});
const emit = defineEmits(["close"]);
const error = ref("");
const critiquing = ref(false);
const talk = inject("talk", null);
const scope = useScope();
const open = (row) => (scope.env ? peekThere(scope.env, row.type, row.n) : peek(row.type, row.n));
const status = computed(() => props.resource.data.status);
const current = computed(() => props.resource.data.current || 1);
const phases = computed(() =>
    props.resource.data.phases.map((p, i) => ({
        ...p,
        i: i + 1,
        rows: [
            ...p.todos.map((n) => scope.rows("todo").find((t) => t.n === n)),
            ...(p.tickets || []).map((n) => scope.rows("ticket").find((t) => t.n === n)),
        ].filter(Boolean),
    }))
);
watchEffect(() => {
    if (props.readOnly) return;
    const known = new Set(scope.rows("todo").map((t) => t.n));
    const missing = props.resource.data.phases.flatMap((p) => p.todos).filter((n) => !known.has(n));
    if (missing.length) scope.holding("todo", missing).catch((e) => (error.value = e.message));
});
const done = (p) => p.rows.length > 0 && p.rows.every((t) => t.completed);
const planned = computed(() => phases.value.flatMap((p) => p.rows));
const finished = computed(() => planned.value.filter((t) => t.completed).length);
const building = computed(() => status.value === "building");
const stage = computed(() => props.resource.data.stage || (phases.value.length ? "todos" : "phases"));
const button = computed(
    () =>
        ({
            draft: ["approve", "Approve"],
            ready: ["approve", "Approve"],
            waiting: ["continue", "Continue"],
            parked: ["start", "Resume"],
            done: ["finish", "Finish"],
        })[status.value] || null
);

const holdsTickets = computed(() => (props.resource.data.phases || []).some((p) => (p.tickets || []).length));
const shared = computed(() => props.resource.data.worktree === "shared");

async function run(action, body = {}) {
    error.value = "";
    try {
        await scope.api.act("plan", props.resource.n, action, body);
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
                <template v-if="['active', 'waiting', 'parked'].includes(status)">· phase {{ current }} of {{ phases.length }}</template>
            </span>
            <span class="grow" />
            <template v-if="!readOnly">
                <DownloadLink :resource="resource" />
                <template v-if="!scope.env">
                    <ShareButton :resource="resource" />
                </template>
                <SideToggle mode="timeline" icon="clock" label="Timeline" />
                <CommentToggle :resource="resource" />
                <template v-if="closable">
                    <CloseButton @click="emit('close')" />
                </template>
            </template>
        </header>
        <h2 class="title">{{ resource.title }}</h2>
        <template v-if="resource.data.goal">
            <TextDisplay class="goal" :text="resource.data.goal" />
        </template>
        <template v-if="planned.length">
            <div :class="['overall', {pinned: pinProgress}]">
                <template v-if="pinProgress">
                    <span class="pinned-title">{{ resource.title }}</span>
                </template>
                <ProgressBar :value="finished" :max="planned.length" :busy="building" />
                <span class="overall-figure">{{ finished }} of {{ planned.length }} done</span>
            </div>
        </template>
        <template v-if="!readOnly">
            <div class="actions">
                <template v-if="button">
                    <Btn kind="primary" @click="run(button[0])">{{ button[1] }}</Btn>
                </template>
                <template v-else-if="status === 'building'">
                    <span class="note">The agent is still writing this plan. It can be started once it is ready.</span>
                </template>
                <template v-if="!['done', 'abandoned'].includes(status)">
                    <Btn title="Ask the agent to have other agents critique this plan" @click="critiquing = true">Ask for a critique</Btn>
                    <Btn kind="danger" @click="run('abandon', {why: 'stopped from the viewer'})">Abandon</Btn>
                </template>
                <template v-if="holdsTickets && !['done', 'abandoned'].includes(status)">
                    <Switch
                        :on="shared"
                        word="One worktree for the whole plan"
                        title="Every ticket of this plan is done by the plan's own agent in one worktree, one after another, instead of one worktree per ticket"
                        @change="run('update', {worktree: shared ? 'each' : 'shared'})"
                    />
                </template>
                <template v-if="shared && resource.data.branch">
                    <span class="note">
                        One worktree on the branch {{ resource.data.branch }},
                        {{ resource.data.merged ? "merged" : "not merged yet" }}
                    </span>
                </template>
                <template v-if="critiquing">
                    <PlanCritique :plan="resource" @close="critiquing = false" />
                </template>
                <span class="error">{{ error }}</span>
            </div>
        </template>
        <template v-if="resource.brief">
            <div class="brief">
                <Folded :at="220" :keep="160">
                    <TextDisplay :text="resource.brief" />
                </Folded>
            </div>
        </template>
        <Sections :sections="resource.sections" />
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
                        <template v-if="talk">
                            <button type="button" class="say" title="Comment on this phase" @click="talk.say(`Phase ${p.i}: ${p.title}`)">
                                <Icon name="bubble" :size="12" />
                            </button>
                        </template>
                    </div>
                    <template v-if="p.when">
                        <div class="when">complete when {{ p.when }}</div>
                    </template>
                    <template v-for="t in p.rows" :key="`${t.type}-${t.n}`">
                        <div class="line">
                            <button type="button" :class="['row', {completed: t.completed}]" @click="open(t)">
                                <template v-if="t.type === 'ticket'">
                                    <Icon class="ticket-mark" name="ticket" :size="12" />
                                </template>
                                <template v-else>
                                    <Dot :kind="state(t)" />
                                </template>
                                <span class="rn">#{{ t.n }}</span>
                                <span class="rt">{{ t.title }}</span>
                            </button>
                            <template v-if="talk">
                                <button type="button" class="say" title="Comment on this row" @click="talk.say(`#${t.n} ${t.title}`)">
                                    <Icon name="bubble" :size="12" />
                                </button>
                            </template>
                        </div>
                    </template>
                    <template v-if="building && stage === 'todos'">
                        <template v-for="j in Math.max(0, 3 - p.rows.length)" :key="`row-bone-${j}`">
                            <div class="line bones" aria-hidden="true"><span class="bone row-bone" /></div>
                        </template>
                    </template>
                </li>
            </template>
            <template v-if="building && stage === 'phases'">
                <template v-for="i in 2" :key="`phase-bone-${i}`">
                    <li class="phase skeleton" aria-hidden="true">
                        <div class="phead">
                            <span class="mark"><Icon name="circle" :size="14" /></span>
                            <span class="ptitle bone" />
                        </div>
                    </li>
                </template>
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
}
.kind,
.status {
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
.status.approved {
    color: var(--created);
}
.status.parked {
    color: var(--parked);
}
.phase.skeleton {
    opacity: 0.4;
    pointer-events: none;
}

.bone {
    display: block;
    height: 11px;
    border-radius: 4px;
    background: linear-gradient(90deg, var(--border) 25%, var(--border-2) 37%, var(--border) 63%);
    background-size: 400% 100%;
    animation: bone 1.4s ease infinite;
}

.ptitle.bone {
    width: 42%;
}

.line.bones {
    height: 26px;
}

.row-bone {
    width: 58%;
    margin-left: 22px;
}

.line.bones:nth-child(odd) .row-bone {
    width: 44%;
}

@keyframes bone {
    from {
        background-position: 100% 50%;
    }

    to {
        background-position: 0 50%;
    }
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
.overall {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 6px 0 14px;
}

.overall .track {
    flex: 1;
}

.overall-figure {
    flex: none;
    color: var(--text-3);
    font-size: 12px;
}

.overall.pinned {
    position: sticky;
    top: 0;
    z-index: 2;
    margin: 0 0 8px;
    padding: 12px 0;
    background: var(--bg);
    container-type: scroll-state;
}

.pinned-title {
    display: none;
    flex: 0 1 auto;
    min-width: 0;
    max-width: 45%;
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    font-weight: 600;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.overall.pinned::after {
    position: absolute;
    top: 100%;
    right: 0;
    left: 0;
    height: 14px;
    background: linear-gradient(to bottom, var(--bg), transparent);
    content: "";
    opacity: 0;
    pointer-events: none;
}

@container scroll-state(stuck: top) {
    .pinned-title {
        display: block;
    }

    .overall.pinned::after {
        opacity: 1;
    }
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
.line {
    display: flex;
    align-items: center;
}

.line .row {
    flex: 1;
    min-width: 0;
}

.say {
    flex: none;
    display: inline-flex;
    padding: 3px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    opacity: 0;
    cursor: pointer;
}

.line:hover .say,
.phead:hover .say,
.say:focus-visible {
    opacity: 1;
}

.say:hover {
    color: var(--accent-text);
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
