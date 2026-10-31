<script setup>
import {computed, reactive, ref, watch} from "vue";
import Btn from "../kit/Btn.vue";
import Dialog from "../kit/Dialog.vue";
import SwitchCase from "../kit/SwitchCase.vue";
import TextArea from "../kit/TextArea.vue";
import TextDisplay from "../kit/TextDisplay.vue";
import TextInput from "../kit/TextInput.vue";
import OptionsPicker from "../resource/OptionsPicker.vue";
import {answered} from "../chat/answers.js";
import {byRef} from "../domain/records.js";
import TaskBlockForm from "./TaskBlockForm.vue";

const props = defineProps({
    asking: {type: Object, required: true},
    tasks: {type: Array, required: true},
    acts: {type: Object, required: true},
});
const emit = defineEmits(["close"]);
const task = props.asking.task;
const fields = reactive({how: "", why: "", title: task?.title || "", brief: task?.brief || ""});
const wait = ref(null);
const busy = ref(false);
const question = computed(() => (props.asking.kind === "answer" ? answered(byRef(`questions:${props.asking.question}`)) : null));
watch(
    () => question.value?.answer,
    (given) => given != null && emit("close")
);

const FORMS = {
    finish: () => ({
        title: `Finish task ${task.id}`,
        button: `Finish task ${task.id}`,
        ready: () => true,
        send: () => props.acts.finish(task, fields.how.trim()),
    }),
    pause: () => ({
        title: `Pause task ${task.id}`,
        button: `Pause task ${task.id}`,
        ready: () => Boolean(fields.why.trim()),
        send: () => props.acts.pause(task, fields.why.trim()),
    }),
    block: () => ({
        title: `Block task ${task.id}`,
        button: `Block task ${task.id}`,
        ready: () => Boolean(wait.value),
        send: () => props.acts.block(task, wait.value),
    }),
    edit: () => ({
        title: `Edit task ${task.id}`,
        button: "Save",
        ready: () => Boolean(fields.title.trim()),
        send: () => props.acts.edit(task, {title: fields.title.trim(), brief: fields.brief.trim()}),
    }),
    answer: () => ({title: `Question ${props.asking.question}`, button: "", ready: () => false, send: () => null}),
};
const form = FORMS[props.asking.kind]();

async function send() {
    if (!form.ready() || busy.value) return;
    busy.value = true;
    await form.send();
    busy.value = false;
}

const sendOnEnter = (e) => e.target.tagName !== "TEXTAREA" && (e.preventDefault(), send());
</script>

<template>
    <Dialog small fits :title="form.title" @close="emit('close')">
        <div class="task-ask" @keydown.enter="sendOnEnter">
            <SwitchCase :value="asking.kind">
                <template #finish>
                    <p class="label">How was it done? (you can leave this empty)</p>
                    <TextArea
                        :value="fields.how"
                        rows="3"
                        placeholder="In a sentence or two"
                        autofocus
                        @input="fields.how = $event.target.value"
                    />
                </template>
                <template #pause>
                    <p class="label">Why pause it?</p>
                    <TextInput
                        :value="fields.why"
                        placeholder="Such as: another task comes first"
                        autofocus
                        @input="fields.why = $event.target.value"
                    />
                    <p class="hint">The journal stops reminding the agent about it until it is resumed.</p>
                </template>
                <template #block>
                    <TaskBlockForm :task="task" :tasks="tasks" @wait="wait = $event" />
                </template>
                <template #edit>
                    <p class="label">Title</p>
                    <TextInput
                        :value="fields.title"
                        placeholder="What has to be done, in a few words"
                        autofocus
                        @input="fields.title = $event.target.value"
                    />
                    <p class="label">Brief (you can leave this empty)</p>
                    <TextArea
                        :value="fields.brief"
                        rows="4"
                        placeholder="What done looks like"
                        @input="fields.brief = $event.target.value"
                    />
                </template>
                <template #answer>
                    <template v-if="question">
                        <TextDisplay :text="question.text" />
                        <OptionsPicker :question="question" />
                        <p class="hint">A task that waits on this question opens again by itself.</p>
                    </template>
                </template>
            </SwitchCase>
        </div>
        <template v-if="form.button" #foot>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" :disabled="!form.ready()" :busy="busy" @click="send">{{ form.button }}</Btn>
        </template>
    </Dialog>
</template>

<style scoped>
.task-ask {
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

.label:first-child {
    margin-top: 0;
}

.hint {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}
</style>
