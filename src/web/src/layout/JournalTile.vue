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
    isActive,
    journalState,
    leadOf,
    totalsOf,
} from "../sync/hub.js";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import Icon from "../kit/Icon.vue";
import IconCount from "../kit/IconCount.vue";
import Meter from "../kit/Meter.vue";
import Monogram from "../kit/Monogram.vue";
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
const building = (p) => p.status === "building";
const meterOf = (p) => ({
    label: "Plan",
    title: p.title,
    figure: building(p) ? "" : `${p.done}/${p.rows}`,
    detail: building(p) ? "being written" : `phase ${p.current || 1} of ${p.phases}${p.phase ? ` · ${p.phase}` : ""}`,
    value: p.done,
    max: Math.max(1, p.rows),
    busy: building(p),
});
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
    <Tile :href="home" :label="`Open ${journal.project}`" :tone="isActive(state) ? 'live' : ''" :wide="open && !!lead">
        <div class="jt-head">
            <Monogram :text="journal.project" :tint="journal.summary ? journal.summary.color : ''" :size="34" />
            <div class="jt-names">
                <h3 class="jt-project">{{ journal.project }}</h3>
                <span class="jt-where">{{ lead ? lead.name : `port ${journal.port}` }}</span>
            </div>
            <template v-if="journal.current">
                <Chip class="jt-here">this one</Chip>
            </template>
            <a class="jt-newtab" :href="home" target="_blank" title="Open this journal in a new tab">
                <Icon name="open" :size="13" />
            </a>
        </div>
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
                    <Meter v-bind="meterOf(plan)">
                        <template v-if="wordFor(plan)">
                            <Btn kind="primary" small @click="runStep(lead, plan)">{{ wordFor(plan) }}</Btn>
                        </template>
                    </Meter>
                </template>
                <div class="jt-foot">
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
                </div>
            </template>
            <template #unreadable>
                <p class="jt-focus past">This journal runs {{ journal.version || "an older version" }}; the hub reads 2.3.0 and up.</p>
            </template>
        </SwitchCase>
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
                        <StatusLabel class="jt-env-state" :state="envState(e)" :size="7">{{ STATE_WORDS[envState(e)] }}</StatusLabel>
                        <a class="jt-env-name" :href="server.page(e.name)">{{ e.name }}</a>
                        <span class="jt-env-work">{{ focusOf(e).known ? focusOf(e).title : "" }}</span>
                        <span class="jt-env-counts">
                            <template v-for="c in countsOf(e.counts)" :key="c.key">
                                <IconCount :icon="c.icon" :count="c.n" :title="c.text" :hot="c.hot" :href="server.page(e.name, c.page)" />
                            </template>
                        </span>
                        <span class="jt-env-agent">{{ agentLine(e) }}</span>
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
                    </div>
                    <template v-for="p in e.plans" :key="p.n">
                        <Meter class="jt-env-plan" v-bind="meterOf(p)">
                            <template v-if="wordFor(p)">
                                <Btn kind="primary" small @click="runStep(e, p)">{{ wordFor(p) }}</Btn>
                            </template>
                        </Meter>
                    </template>
                </div>
            </template>
        </template>
    </Tile>
</template>

<style scoped>
.jt-head {
    display: flex;
    align-items: center;
    gap: 12px;
    min-width: 0;
}

.jt-names {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 2px;
    min-width: 0;
}

.jt-project {
    margin: 0;
    overflow: hidden;
    color: var(--text);
    font-size: 16px;
    font-weight: 600;
    letter-spacing: -0.01em;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.jt-where {
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
    width: 28px;
    height: 28px;
    margin-right: -6px;
    border-radius: 6px;
    color: var(--text-3);
}

.jt-newtab:hover {
    background: var(--sel);
    color: var(--text);
}

.jt-now {
    display: flex;
    flex-direction: column;
    gap: 6px;
    min-width: 0;
}

.jt-focus {
    display: -webkit-box;
    margin: 2px 0 0;
    overflow: hidden;
    color: var(--text);
    font-size: 14px;
    line-height: 1.45;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 2;
}

.jt-focus.past {
    color: var(--text-2);
}

.jt-caption {
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
}

.jt-foot {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 8px 16px;
    margin-top: auto;
    padding-top: 12px;
    border-top: 1px solid var(--line);
}

.jt-fold {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    margin: -4px -8px -4px auto;
    padding: 4px 8px;
    border: 0;
    border-radius: 6px;
    background: none;
    color: var(--text-3);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.jt-fold:hover {
    background: var(--sel);
    color: var(--text);
}

.jt-fold .ico {
    transition: transform 0.18s var(--ease);
}

.jt-fold.open .ico {
    transform: rotate(180deg);
}

.jt-tools {
    display: flex;
    align-items: center;
    gap: 14px;
    min-height: 38px;
    padding: 0 18px;
    font-size: 12px;
}

.jt-tool {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    color: var(--text-2);
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
    padding: 10px 18px;
    border-top: 1px solid var(--line);
}

.jt-env-line {
    display: grid;
    grid-template-columns: 110px minmax(80px, 170px) minmax(0, 1fr) auto auto auto;
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
    font-size: 13px;
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
    font-size: 12.5px;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.jt-env-counts {
    display: inline-flex;
    gap: 12px;
}

.jt-env-agent {
    color: var(--text-3);
    font-size: 11.5px;
    font-variant-numeric: tabular-nums;
    white-space: nowrap;
}

.jt-env-plan {
    max-width: 560px;
    padding: 2px 0 4px 126px;
}

@container (max-width: 720px) {
    .jt-env-line {
        display: flex;
        flex-wrap: wrap;
        gap: 6px 12px;
    }

    .jt-env-state {
        width: 84px;
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
