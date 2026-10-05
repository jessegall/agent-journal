<script setup>
import {HELPER_WORDS, helperLine, helperName, helperReport, helperState, stateAt} from "../domain/helpers.js";
import {nextTick, onMounted, ref} from "vue";
import {api} from "../api/client.js";
import {ago} from "../format/time.js";
import Btn from "../kit/Btn.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import AgentStopButton from "./AgentStopButton.vue";

const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["changed", "inspect"]);
const LINES = 5;
const busy = ref(false);
const refusal = ref("");
const confirming = ref(false);
const whole = ref(false);
const reportBox = ref(null);
const clipped = ref(false);
const name = () => helperName(props.row);
const report = () => helperReport(props.row);
const state = () => helperState(props.row);
const word = () => (state() === "finished" ? `Closed ${ago(stateAt(props.row))}` : HELPER_WORDS[state()]);

async function remove() {
    busy.value = true;
    refusal.value = "";
    try {
        await api.act("helper", props.row.n, "complete");
        confirming.value = false;
        emit("changed");
    } catch (e) {
        refusal.value = e.message;
    } finally {
        busy.value = false;
    }
}

onMounted(() =>
    nextTick(() => reportBox.value && (clipped.value = reportBox.value.$el.scrollHeight > reportBox.value.$el.clientHeight + 1))
);
</script>

<template>
    <div :class="['helper', state()]">
        <div class="helper-head">
            <span :class="['helper-dot', state()]" />
            <button type="button" class="helper-what" title="Open this helper's inspector" @click="emit('inspect')">
                <strong>{{ name() }}</strong>
                {{ row.title }}
                <small>{{ helperLine(row) }}</small>
            </button>
            <span :class="['helper-state', state()]">{{ word() }}</span>
            <template v-if="state() === 'running'">
                <AgentStopButton
                    quiet
                    :environment="name()"
                    :work="row.title"
                    :stop="() => api.act('helper', row.n, 'stop')"
                    @stopped="emit('changed')"
                />
            </template>
        </div>
        <template v-if="report()">
            <TextDisplay ref="reportBox" :class="['helper-report', {whole}]" :text="report()" :style="{'--lines': LINES}" />
            <template v-if="clipped || whole">
                <button type="button" class="helper-more" @click="whole = !whole">
                    {{ whole ? "Show less" : "Show the whole report" }}
                </button>
            </template>
        </template>
        <template v-if="state() === 'reported'">
            <template v-if="confirming">
                <div class="helper-confirm">
                    <p>
                        Remove the environment of {{ name() }} and its working copy of the code? Its report stays here under Closed, and the
                        commits it made are kept.
                    </p>
                    <div class="helper-confirm-buttons">
                        <Btn small @click="confirming = false">Cancel</Btn>
                        <Btn small kind="danger" :busy="busy" @click="remove">Remove</Btn>
                    </div>
                </div>
            </template>
            <template v-else>
                <Btn small class="helper-remove" @click="confirming = true">Remove helper and its working copy</Btn>
            </template>
        </template>
        <template v-if="refusal">
            <p class="helper-refusal">{{ refusal }}</p>
        </template>
    </div>
</template>

<style scoped>
.helper-refusal {
    margin: 6px 0 0;
    color: var(--danger);
    font-size: 12px;
}

.helper {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 7px 8px;
    border-radius: 6px;
}

.helper + .helper {
    border-top: 1px solid var(--line);
}

.helper.finished {
    opacity: 0.7;
}

.helper-head {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 0;
}

.helper-dot {
    flex: none;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-4);
}

.helper-dot.running {
    background: var(--accent);
}

.helper-dot.reported {
    background: var(--tone-good);
}

.helper-what {
    flex: 1;
    min-width: 0;
    padding: 0;
    border: 0;
    background: none;
    color: var(--text);
    font: inherit;
    font-size: 12.5px;
    text-align: left;
    cursor: pointer;
}

.helper-what:hover strong {
    text-decoration: underline;
}

.helper-what small {
    display: block;
    color: var(--text-3);
    font-size: 11px;
}

.helper-state {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
}

.helper-state.reported {
    color: var(--tone-good);
}

.helper-report {
    display: -webkit-box;
    overflow: hidden;
    -webkit-line-clamp: var(--lines);
    -webkit-box-orient: vertical;
    margin-left: 15px;
    padding: 6px 8px;
    border-left: 2px solid var(--line);
    color: var(--text-2);
    font-size: 12px;
}

.helper-report.whole {
    display: block;
    overflow: visible;
}

.helper-more {
    align-self: flex-start;
    margin-left: 15px;
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    font-size: 12px;
    cursor: pointer;
}

.helper-remove {
    align-self: flex-start;
    margin-left: 15px;
}

.helper-confirm {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-left: 15px;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    color: var(--text-2);
    font-size: 12px;
}

.helper-confirm p {
    margin: 0;
}

.helper-confirm-buttons {
    display: flex;
    gap: 8px;
}
</style>
