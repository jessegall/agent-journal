<script setup>
import {ref} from "vue";
import {create} from "../api.js";
import Btn from "../kit/Btn.vue";
import {route} from "../route.js";
import {label, meta, word} from "../store.js";

const props = defineProps({type: String});
const emit = defineEmits(["made", "close"]);
const title = ref("");
const abstract = ref("");
const brief = ref("");
const error = ref("");

async function submit() {
    error.value = "";
    try {
        const resource = await create(route.value.env, props.type, {title: title.value, abstract: abstract.value, brief: brief.value});
        emit("made", resource.n);
    } catch (e) {
        error.value = e.message;
    }
}
</script>

<template>
    <form class="new" @submit.prevent="submit">
        <input v-model="title" :placeholder="`${meta(type).title} title`" maxlength="80" autofocus @keydown.esc="emit('close')" />
        <input v-model="abstract" :placeholder="label(type, 'abstract', 'One short line about it')" maxlength="200" />
        <textarea v-model="brief" :placeholder="label(type, 'brief', 'As long as it needs to be')" rows="3" />
        <div class="foot">
            <span class="error">{{ error }}</span>
            <Btn @click="emit('close')">Cancel</Btn>
            <Btn kind="primary" @click="submit">{{ word(type, "create").replace(/^\w/, (c) => c.toUpperCase()) }}</Btn>
        </div>
    </form>
</template>

<style scoped>
.new {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 14px 22px;
    border-bottom: 1px solid var(--border);
    background: var(--raised);
}
input,
textarea {
    padding: 8px 11px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    resize: vertical;
}
.foot {
    display: flex;
    align-items: center;
    gap: 8px;
}
.error {
    flex: 1;
    color: var(--danger);
    font-size: 12px;
}
</style>
