<script setup>
import CloseButton from "../kit/CloseButton.vue";
import {computed, ref, watchEffect} from "vue";
import CommentToggle from "./CommentToggle.vue";
import ShareButton from "./ShareButton.vue";
import Icon from "../kit/Icon.vue";
import {useScope} from "../composables/scope.js";
import TextDisplay from "../kit/TextDisplay.vue";
import Folded from "../kit/Folded.vue";
import PlanPageActions from "./PlanPageActions.vue";
import PlanPhase from "./PlanPhase.vue";
import PlanReviewRounds from "./PlanReviewRounds.vue";
import SideToggle from "./SideToggle.vue";
import {useWorkersHolding} from "../composables/workers.js";
import ProgressBar from "../kit/ProgressBar.vue";
import {PLAN_STATES, reviewersLine, statusOf} from "../domain/plans.js";
import {peek} from "../route.js";

const props = defineProps({resource: Object, readOnly: Boolean, pinProgress: Boolean, holding: Boolean, closable: {type: Boolean, default: true}});
const emit = defineEmits(["close"]);
const error = ref("");
const fetching = ref(false);
const scope = useScope();
const status = computed(() => statusOf(props.resource));
const reviewers = computed(() => reviewersLine(props.resource.reviewers || 0));
const current = computed(() => props.resource.current_phase || 1);
const taskOf = (id) => scope.rows("tasks").find((t) => t.id === id);
const phaseOf = (title, ids, i) => {
    const rows = ids.map(taskOf).filter(Boolean);
    return {title, i, rows, waiting: fetching.value || props.holding ? ids.length - rows.length : 0};
};
const phases = computed(() => [
    ...(props.resource.phases || []).map((p, i) => ({...p, ...phaseOf(p.title, p.task_ids, i + 1)})),
    ...(props.resource.unphased_task_ids?.length ? [phaseOf("Not in a phase", props.resource.unphased_task_ids, 0)] : []),
]);
const planned = computed(() => phases.value.flatMap((p) => p.rows));
const {rows: workers, loaded: workersLoaded} = useWorkersHolding(planned);
watchEffect(() => {
    if (props.readOnly) return;
    const known = new Set(scope.rows("tasks").map((t) => t.id));
    const missing = (props.resource.task_ids || []).filter((id) => !known.has(id));
    if (!missing.length) return;
    fetching.value = true;
    scope
        .holding("tasks", missing)
        .catch((e) => (error.value = e.message))
        .finally(() => (fetching.value = false));
});
const finished = computed(() => planned.value.filter((t) => t.state === "done").length);

async function run(act) {
    error.value = "";
    try {
        await scope.api.act("plans", props.resource.id, act);
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
                Plan {{ resource.id }}
            </span>
            <span :class="['status', status]">
                {{ PLAN_STATES[status] || status }}
                <template v-if="['started', 'waiting', 'parked', 'blocked'].includes(status)">· phase {{ current }} of {{ (resource.phases || []).length }}</template>
            </span>
            <template v-if="reviewers">
                <span class="reviewers">{{ reviewers }}</span>
            </template>
            <span class="grow" />
            <template v-if="!readOnly">
                <template v-if="!scope.env">
                    <ShareButton :resource="resource" />
                </template>
                <SideToggle mode="timeline" icon="clock" label="Timeline" />
                <CommentToggle :resource="resource" />
                <template v-if="closable">
                    <CloseButton title="Close the plan" @click="emit('close')" />
                </template>
            </template>
        </header>
        <h2 class="title">{{ resource.title }}</h2>
        <template v-if="resource.blocked_why">
            <p class="note">Blocked: {{ resource.blocked_why }}</p>
        </template>
        <template v-if="planned.length">
            <div :class="['overall', {pinned: pinProgress}]">
                <template v-if="pinProgress">
                    <span class="pinned-title">{{ resource.title }}</span>
                </template>
                <ProgressBar :value="finished" :max="planned.length" />
                <span class="overall-figure">{{ finished }} of {{ planned.length }} done</span>
            </div>
        </template>
        <template v-if="!readOnly">
            <PlanPageActions :plan="resource" :error="error" @run="run" />
        </template>
        <template v-if="resource.brief">
            <div class="brief">
                <Folded :name="`plans:${resource.id}:brief`" :at="220" :keep="160">
                    <TextDisplay :text="resource.brief" />
                </Folded>
            </div>
        </template>
        <ol class="phases">
            <template v-for="p in phases" :key="p.i">
                <PlanPhase
                    :phase="p"
                    :current="p.i === current && ['started', 'waiting'].includes(status)"
                    :workers="workers"
                    :workers-loaded="workersLoaded"
                    @inspect="(worker) => peek('workers', worker.id)"
                />
            </template>
        </ol>
        <PlanReviewRounds :plan="resource" />
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
.reviewers {
    color: var(--text-3);
    font-size: 12px;
}

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

.status.building {
    color: var(--accent-text);
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

.brief {
    margin: 0 0 20px;
    color: var(--text-2);
}

.phases {
    list-style: none;
    margin: 0;
    padding: 0;
}
</style>
