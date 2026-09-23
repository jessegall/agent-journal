<script setup>
import {nextTick, ref, watch} from "vue";
import Btn from "./Btn.vue";
import TextInput from "./TextInput.vue";

const props = defineProps({placeholder: String, action: {type: String, default: "Send"}, locked: Boolean, grows: Number});
const emit = defineEmits(["send"]);
const words = defineModel({type: String, default: ""});
const log = ref(null);
const input = ref(null);

watch(
    () => props.grows,
    () => nextTick(() => (log.value.scrollTop = log.value.scrollHeight))
);

function send() {
    if (props.locked || !words.value.trim()) return;
    emit("send", words.value.trim());
}

defineExpose({focus: () => nextTick(() => input.value.$el.focus())});
</script>

<template>
    <div class="chat-panel">
        <div ref="log" class="log">
            <slot />
        </div>
        <slot name="actions" />
        <form class="compose" @submit.prevent="send">
            <TextInput
                ref="input"
                class="words"
                :value="words"
                :placeholder="placeholder"
                :disabled="locked"
                @input="words = $event.target.value"
            />
            <Btn kind="primary" small :disabled="locked || !words.trim()" @click="send">{{ action }}</Btn>
        </form>
    </div>
</template>

<style scoped>
.chat-panel {
    display: flex;
    flex: none;
    flex-direction: column;
    align-self: center;
    width: min(680px, 100%);
    height: 300px;
    border: 1px solid var(--border-2);
    border-radius: 14px;
    background: var(--raised);
}

.log {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 10px;
    min-height: 0;
    overflow-y: auto;
    padding: 14px 16px 6px;
}

.compose {
    display: flex;
    gap: 8px;
    padding: 8px;
    border-top: 1px solid var(--line);
}

.words {
    flex: 1;
}
</style>
