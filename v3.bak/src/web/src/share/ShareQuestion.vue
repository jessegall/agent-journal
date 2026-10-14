<script setup>
import {computed, ref, watch} from "vue";
import OptionList from "../kit/OptionList.vue";
import TextInput from "../kit/TextInput.vue";
import {sendAnswer} from "../api/shared.js";
import {visitorName, rememberName} from "./visitor.js";

const props = defineProps({n: {type: Number, required: true}, options: {type: Array, required: true}, answer: {type: String, default: ""}});
const name = ref(visitorName.value);
watch(visitorName, (value) => (name.value = value));
const chosen = ref("");
const picked = computed(() => props.answer || chosen.value);
const titled = computed(() => props.options.map((title) => ({title})));
const error = ref("");

async function send(choice) {
    error.value = "";
    try {
        await sendAnswer(props.n, name.value.trim(), choice);
    } catch (e) {
        error.value = e.message;
        throw e;
    }
    rememberName(name.value.trim());
    chosen.value = choice;
}
</script>

<template>
    <div class="question">
        <template v-if="picked">
            <p class="picked">Answered: {{ picked }}</p>
        </template>
        <template v-else>
            <template v-if="!visitorName">
                <TextInput class="name" :value="name" placeholder="Your name" aria-label="Your name" @input="name = $event.target.value" />
            </template>
            <OptionList :options="titled" :send="send" :disabled="!name.trim()" immediate />
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
