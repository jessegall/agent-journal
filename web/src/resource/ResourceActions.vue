<script setup>
import {computed, ref} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import {route} from "../route.js";
import {meta, word} from "../state/store.js";

const props = defineProps({resource: Object});
const emit = defineEmits(["edit"]);
const error = ref("");
const prompt = ref("");
const text = ref("");
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
</script>

<template>
    <div class="actions">
        <template v-if="prompt">
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
.error {
    color: var(--danger);
    font-size: 12px;
}
</style>
