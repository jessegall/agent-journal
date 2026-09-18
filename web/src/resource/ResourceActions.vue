<script setup>
import {computed, ref} from "vue";
import {act} from "../api.js";
import Btn from "../kit/Btn.vue";
import {route} from "../route.js";
import {meta, reload, word} from "../store.js";

const props = defineProps({resource: Object});
const error = ref("");
const asking = ref("");
const text = ref("");
const offered = computed(() => (props.resource.completed ? ["delete"] : ["complete", "delete"]));

async function run(method) {
    error.value = "";
    try {
        await act(
            route.value.env,
            props.resource.type,
            props.resource.n,
            word(props.resource.type, method),
            method === "complete" ? {how: text.value} : {}
        );
        asking.value = "";
        text.value = "";
        await reload();
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <div class="actions">
        <template v-if="asking">
            <input
                v-model="text"
                :placeholder="meta(resource.type).labels.outcome || 'A word on how'"
                autofocus
                @keydown.enter="run(asking)"
                @keydown.esc="asking = ''"
            />
            <Btn kind="primary" small @click="run(asking)">{{ word(resource.type, asking) }}</Btn>
            <Btn small @click="asking = ''">Cancel</Btn>
        </template>
        <template v-else>
            <Btn
                v-for="m in offered"
                :key="m"
                :kind="m === 'complete' ? 'primary' : 'danger'"
                small
                @click="m === 'complete' ? (asking = m) : run(m)"
            >
                {{ word(resource.type, m) }}
            </Btn>
        </template>
        <span v-if="error" class="error">{{ error }}</span>
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
