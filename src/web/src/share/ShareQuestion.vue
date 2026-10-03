<script setup>
import {ref} from "vue";
import Btn from "../kit/Btn.vue";
import TextInput from "../kit/TextInput.vue";
import {sendAnswer} from "../api/shared.js";
import {remember, remembered} from "../composables/remembered.js";
import {NAME_KEY} from "./visitor.js";

const props = defineProps({n: {type: Number, required: true}, options: {type: Array, required: true}, answer: {type: String, default: ""}});
const known = remembered(NAME_KEY, "");
const name = ref(known);
const picked = ref(props.answer);
const sending = ref("");
const error = ref("");

async function pick(choice) {
    if (!name.value.trim() || sending.value) return;
    error.value = "";
    sending.value = choice;
    try {
        await sendAnswer(props.n, name.value.trim(), choice);
        remember(NAME_KEY, name.value.trim());
        picked.value = choice;
    } catch (e) {
        error.value = e.message;
    } finally {
        sending.value = "";
    }
}
</script>

<template>
    <div class="question">
        <template v-if="picked">
            <p class="picked">Answered: {{ picked }}</p>
        </template>
        <template v-else>
            <template v-if="!known">
                <TextInput class="name" :value="name" placeholder="Your name" aria-label="Your name" @input="name = $event.target.value" />
            </template>
            <div class="options">
                <template v-for="option in options" :key="option">
                    <Btn small :disabled="!name.trim() || !!sending" @click="pick(option)">{{ sending === option ? "Sending…" : option }}</Btn>
                </template>
            </div>
            <template v-if="error">
                <p class="error">{{ error }}</p>
            </template>
        </template>
    </div>
</template>

<style scoped>
.question {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 6px;
}

.options {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.name {
    max-width: 240px;
}

.picked {
    margin: 0;
    color: var(--text-3);
    font-size: 13px;
}

.error {
    margin: 0;
    color: var(--danger);
    font-size: 12.5px;
}
</style>
