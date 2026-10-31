<script setup>
import {computed, reactive, watch} from "vue";
import TextArea from "../kit/TextArea.vue";
import TextInput from "../kit/TextInput.vue";
import {isClosed} from "../domain/row.js";
import {statusOf} from "../domain/taskBoard.js";
import {waitersOf} from "../domain/taskGraph.js";
import {useScope} from "../composables/scope.js";
import TaskStatusIcon from "./TaskStatusIcon.vue";

const props = defineProps({task: {type: Object, required: true}, tasks: {type: Array, required: true}});
const emit = defineEmits(["wait"]);
const scope = useScope();
const form = reactive({kind: "task", picked: 0, until: "", why: ""});
const KINDS = [
    {key: "task", title: "Another task", text: "It opens again once that task is done."},
    {key: "question", title: "A question to you", text: "It opens again once you answer it."},
    {
        key: "command",
        title: "A command that has to pass",
        text: "The journal runs it every 2 minutes and opens the task the first time it passes.",
    },
    {key: "reason", title: "Only a reason", text: "Nothing opens it by itself; you or the agent unblock it."},
];

// the tasks that already wait on this one, however far up, are left out, so a wait never goes round in a circle
const above = computed(() => {
    const found = new Set();
    const climb = (id) => waitersOf(id, props.tasks).forEach((t) => !found.has(t.id) && (found.add(t.id), climb(t.id)));
    climb(props.task.id);
    return found;
});
const pickable = computed(() => props.tasks.filter((t) => t.id !== props.task.id && statusOf(t) !== "done" && !above.value.has(t.id)));
const questions = computed(() => scope.rows("questions").filter((q) => !isClosed(q)));
const BODIES = {
    task: () => (form.picked ? {on: [`task:${form.picked}`], why: form.why.trim()} : null),
    question: () => (form.picked ? {on: [`question:${form.picked}`], why: form.why.trim()} : null),
    command: () => (form.until.trim() ? {until: form.until.trim(), why: form.why.trim()} : null),
    reason: () => (form.why.trim() ? {why: form.why.trim()} : null),
};
const wait = computed(() => BODIES[form.kind]());
watch(wait, (body) => emit("wait", body), {immediate: true});

function choose(kind) {
    form.kind = kind;
    form.picked = 0;
}
</script>

<template>
    <div class="task-block-form">
        <p class="label">What does task {{ task.id }} wait on?</p>
        <template v-for="k in KINDS" :key="k.key">
            <button type="button" :class="['kind', {on: form.kind === k.key}]" @click="choose(k.key)">
                <span class="dot" />
                <span>
                    <b>{{ k.title }}</b>
                    <small>{{ k.text }}</small>
                </span>
            </button>
            <template v-if="form.kind === k.key && k.key === 'task'">
                <div class="pick">
                    <template v-for="t in pickable" :key="t.id">
                        <button type="button" :class="{on: form.picked === t.id}" @click="form.picked = t.id">
                            <TaskStatusIcon :status="statusOf(t)" />
                            <span class="number">{{ t.id }}</span>
                            <span class="title">{{ t.title }}</span>
                        </button>
                    </template>
                </div>
                <template v-if="above.size">
                    <p class="hint">Tasks that already wait on task {{ task.id }} are left out, so a wait never goes round in a circle.</p>
                </template>
            </template>
            <template v-if="form.kind === k.key && k.key === 'question'">
                <template v-if="questions.length">
                    <div class="pick">
                        <template v-for="q in questions" :key="q.id">
                            <button type="button" :class="{on: form.picked === q.id}" @click="form.picked = q.id">
                                <TaskStatusIcon status="asked" />
                                <span class="number">Q{{ q.id }}</span>
                                <span class="title">{{ q.text }}</span>
                            </button>
                        </template>
                    </div>
                </template>
                <template v-else>
                    <p class="hint">There is no open question. Ask one in the chat first.</p>
                </template>
            </template>
            <template v-if="form.kind === k.key && k.key === 'command'">
                <TextInput
                    class="mono"
                    :value="form.until"
                    placeholder="A shell command, such as curl -sf localhost:8650/health"
                    @input="form.until = $event.target.value"
                />
            </template>
            <template v-if="form.kind === k.key && k.key === 'reason'">
                <TextArea :value="form.why" rows="3" placeholder="The reason it is blocked" @input="form.why = $event.target.value" />
            </template>
        </template>
        <template v-if="form.kind !== 'reason'">
            <p class="label">Why it is blocked (you can leave this empty)</p>
            <TextInput :value="form.why" placeholder="In a few words" @input="form.why = $event.target.value" />
        </template>
    </div>
</template>

<style scoped>
.task-block-form {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.label {
    margin: 4px 0 0;
    color: var(--text-2);
    font-size: 12.5px;
    font-weight: 500;
}

.kind {
    display: flex;
    align-items: flex-start;
    gap: 10px;
    width: 100%;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: none;
    color: var(--text-2);
    font: inherit;
    text-align: left;
    cursor: pointer;
    transition:
        background-color 0.12s ease,
        border-color 0.12s ease;
}

.kind:hover {
    background: var(--hover);
}

.kind.on {
    border-color: var(--border-3);
    background: var(--sel);
}

.dot {
    flex: none;
    width: 14px;
    height: 14px;
    margin-top: 2px;
    border: 1.5px solid var(--border-3);
    border-radius: 50%;
}

.kind.on .dot {
    border: 4.5px solid var(--text);
}

.kind b {
    display: block;
    color: var(--text);
    font-weight: 500;
}

.kind small {
    color: var(--text-3);
    font-size: 12px;
}

.pick {
    display: flex;
    flex-direction: column;
    max-height: 156px;
    overflow: auto;
    border: 1px solid var(--border-2);
    border-radius: 7px;
}

.pick button {
    display: flex;
    flex: none;
    align-items: center;
    gap: 8px;
    height: 30px;
    padding: 0 9px;
    border: 0;
    background: none;
    color: var(--text-2);
    font: 12.5px var(--font);
    text-align: left;
    cursor: pointer;
}

.pick button:hover {
    background: var(--hover);
}

.pick button.on {
    background: var(--sel);
    color: var(--text);
}

.number {
    flex: none;
    width: 28px;
    color: var(--text-4);
    font: 11.5px var(--mono);
}

.title {
    flex: 1;
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.hint {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
