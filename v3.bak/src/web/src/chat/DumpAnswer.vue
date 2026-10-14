<script setup>
import {ref} from "vue";
import Icon from "../kit/Icon.vue";
import TextInput from "../kit/TextInput.vue";

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
    <form class="dump-answer" @submit.prevent="go">
        <TextInput class="dump-answer-field" :value="text" :placeholder="placeholder" @input="text = $event.target.value">
            <template #end>
                <button type="submit" class="dump-answer-send" :title="action" :aria-label="action" :disabled="sending || !text.trim()">
                    <Icon name="send" :size="13" />
                </button>
            </template>
        </TextInput>
    </form>
</template>

<style scoped>
.dump-answer {
    display: flex;
    width: 100%;
}

.dump-answer-field {
    flex: 1;
    height: 36px;
}

.dump-answer-send {
    display: grid;
    place-items: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border: 0;
    border-radius: 6px;
    background: var(--accent);
    color: #fff;
    cursor: pointer;
    transition:
        opacity 0.15s,
        background 0.15s;
}

.dump-answer-send:disabled {
    background: var(--sel);
    color: var(--text-4);
    cursor: default;
}
</style>
