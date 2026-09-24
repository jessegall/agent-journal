<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";

const props = defineProps({
    placeholder: {type: String, default: ""},
    action: {type: String, default: "Answer"},
    send: {type: Function, required: true},
});
const text = ref("");
const sending = ref(false);

async function go() {
    if (sending.value || !text.value.trim()) return;
    sending.value = true;
    try {
        await props.send(text.value.trim());
        text.value = "";
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <div class="dump-answer">
        <textarea v-model="text" rows="1" :placeholder="placeholder" @keydown.enter.exact.prevent="go" />
        <Btn kind="primary" small :disabled="sending || !text.trim()" @click="go">{{ action }}</Btn>
    </div>
</template>

<style scoped>
.dump-answer {
    display: flex;
    align-items: flex-end;
    gap: 8px;
}

.dump-answer textarea {
    flex: 1;
    min-height: 34px;
    padding: 8px 10px;
    border: 1px solid var(--border-2);
    border-radius: 8px;
    background: var(--bg);
    font-size: 12.5px;
}
</style>
