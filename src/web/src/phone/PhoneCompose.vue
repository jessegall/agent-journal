<script setup>
import {inject, ref} from "vue";
import {ended, flush, hold} from "./outbox.js";
import Btn from "../kit/Btn.vue";
import CloseButton from "../kit/CloseButton.vue";

const props = defineProps({about: {type: String, default: ""}});
const emit = defineEmits(["sent", "unabout"]);
const failed = inject("phoneFailed");
const words = ref("");
const sending = ref(false);

async function send() {
    const text = words.value.trim();
    if (!text || sending.value) return;
    sending.value = true;
    hold(text, props.about);
    words.value = "";
    try {
        await flush();
        emit("sent");
    } catch (error) {
        if (ended(error)) failed(error);
    } finally {
        sending.value = false;
    }
}
</script>

<template>
    <form class="compose" @submit.prevent="send">
        <template v-if="about">
            <div class="compose-about">
                About {{ about.replace(":", " ") }}
                <CloseButton @click="emit('unabout')" />
            </div>
        </template>
        <textarea v-model="words" class="compose-words" rows="2" placeholder="Tell the agent what to do next" />
        <Btn kind="primary" large :busy="sending" @click="send">Send to the agent</Btn>
    </form>
</template>

<style scoped>
.compose {
    display: flex;
    flex-direction: column;
    gap: 8px;
    padding: 10px 0 12px;
    border-top: 1px solid var(--line);
}

.compose-about {
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: var(--accent-text);
    font-size: 13.5px;
}

.compose-words {
    padding: 12px;
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    color: var(--text);
    font: inherit;
    resize: none;
}
</style>
