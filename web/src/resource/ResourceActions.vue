<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import {go, route, swap} from "../route.js";
import {meta, word} from "../state/store.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["edit"]);
const error = ref("");
const prompt = ref("");
const text = ref("");
const tracking = ref(false);
const trackable = computed(() => props.resource.type === "doc" && !props.resource.completed && !props.resource.data.part_of);
const offered = computed(() =>
    props.resource.completed ? ["delete"] : meta(props.resource.type).closed_first ? ["complete"] : ["complete", "delete"]
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

async function track() {
    error.value = "";
    try {
        const design = await api.command("design", "from_doc", {doc: props.resource.n});
        tracking.value = false;
        if (route.value.open) swap("design", design.n);
        else go(route.value.env, "design", design.n);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div class="actions">
        <template v-if="tracking">
            <span class="ask">Keep every later edit of this doc as a revision?</span>
            <Btn small kind="primary" @click="track">Track revisions</Btn>
            <Btn small @click="tracking = false">Cancel</Btn>
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
            <template v-if="!resource.completed">
                <Btn small @click="emit('edit')">Edit</Btn>
            </template>
            <template v-if="trackable">
                <Btn small @click="tracking = true">Track revisions</Btn>
            </template>
            <template v-for="m in offered" :key="m">
                <Btn :kind="m === 'complete' ? 'ghost' : 'danger'" small @click="m === 'complete' ? (prompt = m) : run(m)">
                    {{ word(resource.type, m) }}
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
.ask {
    color: var(--text-2);
    font-size: 12.5px;
}

.error {
    color: var(--danger);
    font-size: 12px;
}
</style>
