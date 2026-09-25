<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {runPlan, setAuto} from "../actions/work.js";
import {planButton} from "./statusline.js";
import {
    STATE_WORDS,
    agentLine,
    ago,
    counted,
    countsOf,
    envState,
    environmentsOf,
    focusOf,
    journalState,
    leadOf,
    planMeter,
    totalsOf,
} from "../sync/hub.js";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import Icon from "../kit/Icon.vue";
import IconCount from "../kit/IconCount.vue";
import Meter from "../kit/Meter.vue";
import StatusLabel from "../kit/StatusLabel.vue";
import Switch from "../kit/Switch.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import Tile from "../kit/Tile.vue";

const props = defineProps({journal: {type: Object, required: true}, open: Boolean});
const emit = defineEmits(["toggle", "changed"]);
const error = ref("");

const server = computed(() => api.journal(props.journal));
const environments = computed(() => environmentsOf(props.journal));
const lead = computed(() => (props.journal.summary ? leadOf(props.journal) : null));
const state = computed(() => journalState(props.journal));
const shape = computed(() => (lead.value ? "live" : "unreadable"));
const home = computed(() => server.value.page((props.journal.summary && props.journal.summary.start) || ""));
const focus = computed(() => focusOf(lead.value));
const plan = computed(() => lead.value.plans[0] || null);
const note = computed(() => (state.value === "idle" && lead.value.agent.at ? `last active ${ago(lead.value.agent.at)}` : ""));
const wordFor = (p) => (planButton({data: p}) || [])[1];

async function manage(fn) {
    error.value = "";
    try {
        await fn();
        emit("changed");
    } catch (e) {
        error.value = e.message;
    }
}

const switchAuto = (e, on) => manage(() => setAuto(on, server.value.in(e.name)));
const runStep = (e, p) => manage(() => runPlan({data: p, n: p.n}, server.value.in(e.name)));
</script>

<template>
    <Tile :href="home" :label="`Open ${journal.project}`" :wide="open && !!lead">
        <template #head>
            <h3 class="jt-project">{{ journal.project }}</h3>
            <span class="jt-where">{{ lead ? lead.name : `port ${journal.port}` }}</span>
            <template v-if="journal.current">
                <Chip class="jt-here">this one</Chip>
            </template>
            <a class="jt-newtab" :href="home" target="_blank" title="Open this journal in a new tab">
                <Icon name="open" :size="13" />
            </a>
        </template>
        <SwitchCase :value="shape">
            <template #live>
                <div class="jt-now">
                    <StatusLabel :state="state" :note="note">{{ STATE_WORDS[state] }}</StatusLabel>
                    <p :class="['jt-focus', {past: !focus.current}]">{{ focus.title }}</p>
                    <template v-if="focus.caption">
                        <span class="jt-caption">{{ focus.caption }}</span>
                    </template>
                </div>
                <template v-if="plan">
                    <Meter v-bind="planMeter(plan)">
                        <template v-if="wordFor(plan)">
                            <Btn small @click="runStep(lead, plan)">{{ wordFor(plan) }}</Btn>
                        </template>
                    </Meter>
                </template>
            </template>
            <template #unreadable>
                <p class="jt-focus past">This journal runs {{ journal.version || "an older version" }}; the hub reads 2.3.0 and up.</p>
            </template>
        </SwitchCase>
        <template v-if="lead" #foot>
            <template v-for="c in countsOf(totalsOf(journal))" :key="c.key">
                <IconCount :icon="c.icon" :count="c.n" :title="c.text" :hot="c.hot" />
            </template>
            <template v-if="lead.auto">
                <Chip>auto</Chip>
            </template>
            <button type="button" :class="['jt-fold', {open}]" :aria-expanded="open" @click="emit('toggle')">
                {{ counted(environments.length, "environment", "environments") }}
                <Icon name="down" :size="12" />
            </button>
        </template>
        <template v-if="open && lead" #more>
            <div class="jt-tools">
                <a class="jt-tool" :href="`${server.origin()}/?chat`" target="_blank" title="Open this journal's chat in its own window">
                    <Icon name="bubble" :size="12" />
                    Open chat
                </a>
                <template v-if="error">
                    <span class="jt-error">{{ error }}</span>
                </template>
            </div>
            <template v-for="e in environments" :key="e.name">
                <div :class="['jt-env', envState(e)]">
                    <div class="jt-env-line">
                        <StatusLabel class="jt-env-state" :state="envState(e)">{{ STATE_WORDS[envState(e)] }}</StatusLabel>
                        <a class="jt-env-name" :href="server.page(e.name)">{{ e.name }}</a>
                        <span class="jt-env-work">{{ focusOf(e).known ? focusOf(e).title : "" }}</span>
                        <span class="jt-env-counts">
                            <template v-for="c in countsOf(e.counts)" :key="c.key">
                                <IconCount :icon="c.icon" :count="c.n" :title="c.text" :hot="c.hot" :href="server.page(e.name, c.page)" />
                            </template>
                        </span>
                        <span class="jt-env-agent">{{ agentLine(e) }}</span>
                        <template v-if="e.owner">
                            <Chip :title="`The journal steers this agent for ${e.owner.replace(':', ' ')}; it needs no auto mode`">
                                Steered by {{ e.owner.replace(":", " ") }}
                            </Chip>
                        </template>
                        <template v-else>
                            <Switch
                                :on="e.auto"
                                word="auto"
                                :title="
                                    e.auto
                                        ? 'The agent works through the to-do list without asking'
                                        : 'The agent asks before picking up the next to-do'
                                "
                                @change="(on) => switchAuto(e, on)"
                            />
                        </template>
                    </div>
                    <template v-for="p in e.plans" :key="p.n">
                        <Meter class="jt-env-plan" v-bind="planMeter(p)">
                            <template v-if="wordFor(p)">
                                <Btn small @click="runStep(e, p)">{{ wordFor(p) }}</Btn>
                            </template>
                        </Meter>
                    </template>
                </div>
            </template>
        </template>
    </Tile>
</template>

<style scoped>
.jt-project {
    min-width: 0;
    margin: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.jt-where {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    color: var(--text-3);
    font-size: 12px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.jt-here {
    align-self: center;
}

.jt-newtab {
    flex: none;
    display: grid;
    place-items: center;
    width: 26px;
    height: 24px;
    border-radius: 6px;
    color: var(--text-3);
}

.jt-newtab:hover {
    background: var(--hover);
    color: var(--text);
}

.jt-now {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
    font-size: 12.5px;
}

.jt-focus {
    display: -webkit-box;
    margin: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 13px;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.jt-focus.past {
    color: var(--text-2);
}

.jt-caption {
    color: var(--text-3);
    font-size: 11px;
    font-variant-numeric: tabular-nums;
}

.jt-fold {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 24px;
    margin-left: auto;
    padding: 0 7px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    cursor: pointer;
}

.jt-fold:hover {
    background: var(--hover);
    color: var(--text);
}

.jt-fold .ico {
    opacity: 0.65;
    transition: transform 0.18s var(--ease);
}

.jt-fold.open .ico {
    transform: rotate(180deg);
}

.jt-tools {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 34px;
    padding: 0 16px;
    font-size: 11.5px;
}

.jt-tool {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-3);
}

.jt-tool:hover {
    color: var(--text);
}

.jt-error {
    margin-left: auto;
    color: var(--danger);
    font-size: 11.5px;
}

.jt-env {
    display: flex;
    flex-direction: column;
    gap: 10px;
    padding: 8px 16px;
    border-top: 1px solid var(--line);
    font-size: 12px;
}

.jt-env-line {
    display: grid;
    grid-template-columns: 100px minmax(80px, 170px) minmax(0, 1fr) auto auto auto;
    align-items: center;
    gap: 16px;
    min-height: 28px;
}

.jt-env.stopped .jt-env-line > :not(.switch-button) {
    opacity: 0.6;
}

.jt-env-name {
    overflow: hidden;
    color: var(--text);
    font-size: 12.5px;
    font-weight: 500;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.jt-env-name:hover {
    color: var(--accent-text);
}

.jt-env-work {
    overflow: hidden;
    color: var(--text-2);
    text-overflow: ellipsis;
    white-space: nowrap;
}

.jt-env-counts {
    display: inline-flex;
    gap: 12px;
    font-size: 11.5px;
}

.jt-env-agent {
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.jt-env-plan {
    max-width: 560px;
    padding: 2px 0 4px 116px;
}

@container (max-width: 720px) {
    .jt-env-line {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 12px;
    }

    .jt-env-state {
        width: 76px;
    }

    .jt-env-name {
        flex: 1;
        min-width: 0;
    }

    .jt-env-work {
        flex-basis: 100%;
        order: 1;
        white-space: normal;
    }

    .jt-env-work:empty,
    .jt-env-counts:empty,
    .jt-env-agent:empty {
        display: none;
    }

    .jt-env-counts {
        order: 2;
    }

    .jt-env-agent {
        order: 3;
        margin-left: auto;
    }

    .jt-env-plan {
        padding-left: 0;
    }
}
</style>
