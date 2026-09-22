<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import Icon from "../kit/Icon.vue";
import {meta, word} from "../state/store.js";
import {linkedTo, open} from "../domain/records.js";
import {peek} from "../route.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["edit"]);
const error = ref("");
const prompt = ref("");
const text = ref("");
const collecting = ref(false);
const collections = computed(() => open("collection").map((c) => c.title));

async function addToCollection() {
    const name = text.value.trim();
    if (!name) return;
    error.value = "";
    try {
        const found =
            open("collection").find((c) => c.title.toLowerCase() === name.toLowerCase()) || (await api.create("collection", {title: name}));
        await api.act("collection", found.n, "add", {refs: [props.resource.ref]});
        collecting.value = false;
        text.value = "";
    } catch (e) {
        error.value = e.message;
    }
}

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
        const plan = await api.command("plan", "from_doc", {doc: props.resource.n});
        peek("plan", plan.n);
    } catch (e) {
        error.value = e.message;
    }
}

const offered = computed(() =>
    props.resource.data.system
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
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div class="actions">
        <template v-if="collecting">
            <input
                v-model="text"
                list="open-collections"
                placeholder="A collection, or a new name"
                autofocus
                @keydown.enter="addToCollection"
                @keydown.esc="collecting = false"
            />
            <datalist id="open-collections">
                <option v-for="c in collections" :key="c" :value="c" />
            </datalist>
            <Btn small @click="addToCollection">Add to collection</Btn>
            <Btn small @click="collecting = false">Cancel</Btn>
        </template>
        <template v-else-if="prompt">
            <input
                v-model="text"
                :placeholder="meta(resource.type).labels.outcome || 'A word on how'"
                autofocus
                @keydown.enter="run(prompt)"
                @keydown.esc="prompt = ''"
            />
            <Btn small @click="run(prompt)">{{ word(resource.type, prompt) }}</Btn>
            <Btn small @click="prompt = ''">Cancel</Btn>
        </template>
        <template v-else>
            <template v-if="plannable">
                <Btn kind="primary" small title="Turn this approved design into a plan that covers every must-have point" @click="makePlan">
                    Make the plan
                </Btn>
            </template>
            <template v-if="!resource.completed && !resource.data.system">
                <Btn small @click="emit('edit')">
                    <Icon name="pencil" :size="12" />
                    Edit
                </Btn>
            </template>
            <template v-if="resource.type !== 'collection'">
                <Btn small @click="collecting = true">
                    <Icon name="folder" :size="12" />
                    Add to collection
                </Btn>
            </template>
            <template v-for="m in offered" :key="m">
                <Btn :kind="m === 'complete' ? 'ghost' : 'danger'" small @click="m === 'complete' ? (prompt = m) : run(m)">
                    <Icon :name="m === 'complete' ? 'check' : 'close'" :size="12" />
                    {{ word(resource.type, m).replace(/^\w/, (c) => c.toUpperCase()) }}
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
    align-items: center;
    gap: 6px;
    margin: 10px 0;
}
input {
    flex: 1;
    padding: 5px 10px;
    border: 1px solid var(--border-2);
    border-radius: 7px;
    background: var(--raised);
}
.error {
    color: var(--danger);
    font-size: 12px;
}
</style>
