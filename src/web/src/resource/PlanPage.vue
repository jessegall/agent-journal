<script setup>
import CloseButton from "../kit/CloseButton.vue";
import {computed, ref, watchEffect} from "vue";
import CommentToggle from "./CommentToggle.vue";
import ShareButton from "./ShareButton.vue";
import SideToggle from "./SideToggle.vue";
import DownloadLink from "./DownloadLink.vue";
import Icon from "../kit/Icon.vue";
import {useScope} from "../composables/scope.js";
import TextDisplay from "../kit/TextDisplay.vue";
import Sections from "./Sections.vue";
import Folded from "../kit/Folded.vue";
import PlanPageActions from "./PlanPageActions.vue";
import PlanPhase from "./PlanPhase.vue";
import TicketAgent from "../agents/TicketAgent.vue";
import {useHelpers} from "../composables/helpers.js";
import {helperCard, helperEnvironment, helperName} from "../domain/helpers.js";
import ProgressBar from "../kit/ProgressBar.vue";

const props = defineProps({resource: Object, readOnly: Boolean, pinProgress: Boolean, closable: {type: Boolean, default: true}});
const emit = defineEmits(["close"]);
const error = ref("");
const {rows: helpers, loaded: helpersLoaded} = useHelpers();
const inspected = ref(null);
const fetching = ref(false);
const scope = useScope();
const status = computed(() => props.resource.data.status);
const current = computed(() => props.resource.data.current || 1);
const phases = computed(() =>
    props.resource.data.phases.map((p, i) => {
        const named = [
            ...p.todos.map((n) => scope.rows("todo").find((t) => t.n === n)),
            ...(p.tickets || []).map((n) => scope.rows("ticket").find((t) => t.n === n)),
        ];
        const rows = named.filter(Boolean);
        return {...p, i: i + 1, rows, waiting: fetching.value ? named.length - rows.length : 0};
    })
);
watchEffect(() => {
    if (props.readOnly) return;
    const known = new Set(scope.rows("todo").map((t) => t.n));
    const missing = props.resource.data.phases.flatMap((p) => p.todos).filter((n) => !known.has(n));
    if (!missing.length) return;
    fetching.value = true;
    scope
        .holding("todo", missing)
        .catch((e) => (error.value = e.message))
        .finally(() => (fetching.value = false));
});
const data = computed(() => props.resource.data);
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
            done: ["finish", "Close"],
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
                    <CloseButton title="Close the plan" @click="emit('close')" />
                </template>
            </template>
        </header>
        <h2 class="title">{{ resource.title }}</h2>
        <template v-if="data.goal">
            <TextDisplay class="goal" :text="data.goal" />
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
            <PlanPageActions
                :plan="resource"
                :status="status"
                :button="button"
                :holds-tickets="holdsTickets"
                :shared="shared"
                :error="error"
                @run="run"
            />
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
                <PlanPhase
                    :phase="p"
                    :current="p.i === current && (status === 'active' || status === 'waiting')"
                    :boning="building && stage === 'todos'"
                    :helpers="helpers"
                    :helpers-loaded="helpersLoaded"
                    @inspect="inspected = $event"
                />
            </template>
            <template v-if="building && stage === 'phases'">
                <template v-for="i in 2" :key="`phase-bone-${i}`">
                    <PlanPhase skeleton />
                </template>
            </template>
        </ol>
        <template v-if="inspected">
            <TicketAgent
                :card="helperCard(inspected)"
                :env="helperEnvironment(inspected)"
                kind="helper"
                :label="helperName(inspected)"
                @close="inspected = null"
            />
        </template>
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
