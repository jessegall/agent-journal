<script setup>
import {computed, ref} from "vue";
import Btn from "../kit/Btn.vue";
import {pointRows, PROOF_WORDS, isCheckable} from "../domain/workerShift.js";

const props = defineProps({worker: {type: Object, required: true}, api: {type: Object, required: true}});
const task = computed(() => props.worker.task || {points: [], todos: [], proofs: []});
const points = computed(() => pointRows(task.value));
const clockedOut = computed(() => props.worker.state === "clocked out");
const writing = ref(0);
const shortfall = ref("");
const refusal = ref("");

async function act(name, body) {
    refusal.value = "";
    try {
        await props.api.act("workers", props.worker.id, name, body);
        writing.value = 0;
        shortfall.value = "";
    } catch (e) {
        refusal.value = e.message;
    }
}

const check = (point) => act("check", {point});
const sendBack = (point) => act("short_check", {point, shortfall: shortfall.value});
</script>

<template>
    <template v-if="task.task_id">
        <section class="shift">
            <div class="heading">Task {{ task.task_id }}, point by point</div>
            <ol class="points">
                <template v-for="row in points" :key="row.point">
                    <li class="point">
                        <div class="wording">{{ row.point }}. {{ row.wording }}</div>
                        <template v-if="row.proof">
                            <div class="proof">
                                <span :class="['state', row.proof.state.replace(/[ ,]+/g, '-')]">{{ PROOF_WORDS[row.proof.state] }}</span>
                                <span class="text">{{ row.proof.text }}</span>
                            </div>
                            <template v-if="row.proof.shortfall">
                                <div class="shortfall">Sent back: {{ row.proof.shortfall }}</div>
                            </template>
                        </template>
                        <template v-else>
                            <div class="proof missing">No proof yet</div>
                        </template>
                        <template v-if="clockedOut && isCheckable(row.proof)">
                            <div class="checks">
                                <Btn small kind="primary" @click="check(row.point)">Check</Btn>
                                <Btn small @click="writing = row.point">Send back</Btn>
                            </div>
                            <template v-if="writing === row.point">
                                <form class="send-back" @submit.prevent="sendBack(row.point)">
                                    <input v-model="shortfall" placeholder="What is missing" />
                                    <Btn small kind="primary" :disabled="!shortfall.trim()" @click="sendBack(row.point)">Send it back</Btn>
                                </form>
                            </template>
                        </template>
                    </li>
                </template>
            </ol>
            <template v-if="task.todos.length">
                <div class="heading">The worker's to-do list</div>
                <ul class="todos">
                    <template v-for="(item, i) in task.todos" :key="i">
                        <li :class="['todo', {complete: item.complete}]">{{ item.text }}</li>
                    </template>
                </ul>
            </template>
            <template v-if="refusal">
                <div class="refusal">{{ refusal }}</div>
            </template>
        </section>
    </template>
</template>

<style scoped>
.shift {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 14px;
    border-bottom: 1px solid var(--border);
}

.heading {
    color: var(--text-3);
    font-size: 11px;
}

.points,
.todos {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin: 0;
    padding-left: 0;
    list-style: none;
}

.point {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.wording {
    color: var(--text);
}

.proof {
    display: flex;
    align-items: baseline;
    gap: 6px;
    color: var(--text-2);
}

.proof.missing {
    color: var(--text-3);
}

.state {
    flex: 0 0 auto;
    padding: 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    font-size: 11px;
}

.state.checked,
.state.checked-not-done {
    border-color: var(--green);
    color: var(--green);
}

.state.short,
.state.stale {
    border-color: var(--danger);
    color: var(--danger);
}

.shortfall,
.refusal {
    color: var(--danger);
}

.checks,
.send-back {
    display: flex;
    gap: 6px;
}

.send-back input {
    flex: 1 1 auto;
    min-width: 0;
    padding: 2px 6px;
    border: 1px solid var(--border-2);
    border-radius: 4px;
    background: var(--bg);
    color: var(--text);
}

.todo {
    color: var(--text-2);
}

.todo.complete {
    color: var(--text-3);
    text-decoration: line-through;
}
</style>
