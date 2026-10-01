<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import {runPlan, setAuto} from "../actions/work.js";
import {planButton} from "./statusline.js";
import {STATE_WORDS, ago, counted, countsOf, environmentsOf, focusOf, journalState, leadOf, planMeter, totalsOf} from "../sync/hub.js";
import Btn from "../kit/Btn.vue";
import Chip from "../kit/Chip.vue";
import Icon from "../kit/Icon.vue";
import IconCount from "../kit/IconCount.vue";
import Meter from "../kit/Meter.vue";
import StatusLabel from "../kit/StatusLabel.vue";
import {SILENT} from "../domain/agentStates.js";
import SwitchCase from "../kit/SwitchCase.vue";
import Tile from "../kit/Tile.vue";
import JournalTileEnv from "./JournalTileEnv.vue";

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
                    <StatusLabel :class="{silent: state === SILENT}" :state="state" :note="note">{{ STATE_WORDS[state] }}</StatusLabel>
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
                <JournalTileEnv
                    :env="e"
                    :server="server"
                    @auto="(on) => switchAuto(e, on)"
                    @step="(p) => runStep(e, p)"
                    @changed="emit('changed')"
                />
            </template>
        </template>
    </Tile>
</template>

<style scoped>
.status-label.silent {
    --tone: var(--tone-warn);
}

.status-label.silent :deep(.status-word) {
    color: var(--tone-warn);
}

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
</style>
