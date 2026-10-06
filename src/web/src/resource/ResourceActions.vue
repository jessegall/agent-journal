<script setup>
import {MENUED, closeWord, meta, word} from "../domain/spec.js";
import TextInput from "../kit/TextInput.vue";
import Chip from "../kit/Chip.vue";
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import AddToCollection from "./AddToCollection.vue";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {linkedTo} from "../domain/records.js";
import {peek} from "../route.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["edit", "close"]);
const error = ref("");
const prompt = ref("");
const text = ref("");
const collecting = ref(false);

const MUST_HAVE = "must have";
const plannable = computed(
    () =>
        props.resource.type === "doc" &&
        !!props.resource.completed &&
        props.resource.sections.some((s) => s.title.toLowerCase() === MUST_HAVE) &&
        !linkedTo(props.resource.ref).some((r) => r.type === "plan")
);

async function makePlan() {
    error.value = "";
    try {
        const plan = await api.planFromDoc(props.resource.n);
        peek("plan", plan.n);
    } catch (e) {
        error.value = e.message;
    }
}

const locked = computed(() => (props.resource.data.locked === true && props.resource.data.plugin) || "");
const offered = computed(() =>
    props.resource.data.system || locked.value || MENUED.includes(props.resource.type)
        ? []
        : props.resource.completed
          ? ["delete"]
          : meta(props.resource.type).closed_first
            ? ["complete"]
            : ["complete", "delete"]
);

async function run(method) {
    error.value = "";
    try {
        await api.act(
            props.resource.type,
            props.resource.n,
            word(props.resource.type, method),
            method === "complete" ? {how: text.value} : {}
        );
        prompt.value = "";
        text.value = "";
        if (method === "delete") emit("close");
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div class="actions">
        <template v-if="locked">
            <Chip :title="`Made by the ${locked} plugin. It is deleted when the plugin is removed and cannot be closed or removed otherwise.`">
                <Icon name="lock" :size="11" />
                Locked · {{ locked }}
            </Chip>
        </template>
        <template v-if="collecting">
            <AddToCollection :resource="resource" @done="collecting = false" />
        </template>
        <template v-else-if="prompt">
            <TextInput
                :value="text"
                class="grow"
                :placeholder="meta(resource.type).labels.outcome || 'Say how it ended'"
                autofocus
                @keydown.enter="run(prompt)"
                @input="text = $event.target.value"
                @keydown.esc="prompt = ''"
            />
            <Btn small @click="run(prompt)">{{ closeWord(resource.type) }}</Btn>
            <Btn small @click="prompt = ''">Cancel</Btn>
        </template>
        <template v-else>
            <template v-if="plannable">
                <Btn kind="primary" small title="Turn this approved design into a plan that covers every must-have point" @click="makePlan">
                    Make the plan
                </Btn>
            </template>
            <template v-if="!resource.completed && !resource.data.system && resource.type !== 'trigger'">
                <Btn small @click="emit('edit')">
                    <Icon name="pencil" :size="12" />
                    Edit
                </Btn>
            </template>
            <template v-if="resource.type !== 'collection' && !resource.data.system && !MENUED.includes(resource.type)">
                <Btn small @click="collecting = true">
                    <Icon name="folder" :size="12" />
                    Add to collection
                </Btn>
            </template>
            <template v-for="m in offered" :key="m">
                <Btn :kind="m === 'complete' ? 'ghost' : 'danger'" small @click="m === 'complete' ? (prompt = m) : run(m)">
                    <Icon :name="m === 'complete' ? 'check' : 'close'" :size="12" />
                    {{ m === "complete" ? closeWord(resource.type) : "Delete" }}
                </Btn>
            </template>
        </template>
        <template v-if="error">
            <span class="error">{{ error }}</span>
        </template>
    </div>
</template>

<style scoped>
.actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px;
    margin: 10px 0;
}
.grow {
    flex: 1;
}
.error {
    color: var(--danger);
    font-size: 12px;
}
</style>
