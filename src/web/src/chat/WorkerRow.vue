<script setup>
import {stateAt, workerLine, workerName, workerReport, workerReuses, workerState, workerTag} from "../domain/workers.js";
import {nextTick, onMounted, ref} from "vue";
import {ago} from "../format/time.js";
import {seconds} from "../domain/row.js";
import Btn from "../kit/Btn.vue";
import TextDisplay from "../kit/TextDisplay.vue";

const props = defineProps({row: {type: Object, required: true}});
const emit = defineEmits(["inspect"]);
const LINES = 5;
const whole = ref(false);
const reportBox = ref(null);
const clipped = ref(false);
const name = () => workerName(props.row);
const report = () => workerReport(props.row);
const state = () => workerState(props.row);
const tag = () => workerTag(props.row);
const stateLabel = () => (state() === "finished" ? `Closed ${ago(stateAt(props.row))}` : tag().word);
const sentLine = () => [`Sent ${ago(seconds(props.row.created_at))}`, workerReuses(props.row)].filter(Boolean).join(" · ");

onMounted(() =>
    nextTick(() => reportBox.value && (clipped.value = reportBox.value.$el.scrollHeight > reportBox.value.$el.clientHeight + 1))
);
</script>

<template>
    <div :class="['worker', state()]">
        <div class="worker-head">
            <span :class="['worker-dot', tag().state]" />
            <Btn kind="text" class="worker-what" v-tip="'Open this worker'" @click="emit('inspect')">
                <strong class="worker-name">{{ name() }}</strong>
                <span class="worker-job" :title="row.brief">{{ row.brief }}</span>
                <small>{{ workerLine(row) }}</small>
                <small class="worker-reuse">{{ sentLine() }}</small>
            </Btn>
            <div class="worker-side">
                <span :class="['worker-state', tag().state]">{{ stateLabel() }}</span>
            </div>
        </div>
        <template v-if="report()">
            <TextDisplay ref="reportBox" :class="['worker-report', {whole}]" :text="report()" :style="{'--lines': LINES}" />
            <template v-if="clipped || whole">
                <Btn kind="text" class="worker-more" @click="whole = !whole">
                    {{ whole ? "Show less" : "Show the whole report" }}
                </Btn>
            </template>
        </template>
    </div>
</template>

<style scoped>

.worker {
    display: flex;
    flex-direction: column;
    gap: 4px;
    padding: 7px 8px;
    border-radius: 6px;
}

.worker + .worker {
    border-top: 1px solid var(--line);
}

.worker.finished {
    opacity: 0.7;
}

.worker-head {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 4px 8px;
    padding: 6px 0;
}

.worker-side {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    margin-left: auto;
}

.worker-dot {
    flex: none;
    margin-top: 5px;
    width: 7px;
    height: 7px;
    border-radius: 50%;
    background: var(--text-4);
}

.worker-dot.running {
    background: var(--accent);
}

.worker-dot.reported {
    background: var(--tone-good);
}

.worker-dot.needs {
    background: var(--tone-warn);
}

.worker-what {
    flex: 1 1 200px;
    min-width: 0;
    color: var(--text);
    font-size: 12.5px;
}

.worker-name {
    display: block;
}

.worker-job {
    display: -webkit-box;
    overflow: hidden;
    color: var(--text-2);
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
}

.worker-what:hover .worker-name {
    color: var(--accent-text);
}

.worker-what small {
    display: block;
    color: var(--text-3);
    font-size: 11px;
}

.worker-state {
    flex: none;
    color: var(--text-3);
    font-size: 11px;
}

.worker-state.reported {
    color: var(--tone-good);
}

.worker-state.needs {
    color: var(--tone-warn);
}

.worker-report {
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

.worker-report.whole {
    display: block;
    overflow: visible;
}

.worker-more {
    align-self: flex-start;
    margin-left: 15px;
    color: var(--accent-text);
    font-size: 12px;
}
</style>
