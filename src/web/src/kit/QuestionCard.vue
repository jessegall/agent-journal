<script setup>
import {ref} from "vue";
import {api} from "../api.js";

const props = defineProps({question: Object});
const emit = defineEmits(["answered"]);
const own = ref("");

async function answer(text) {
    if (!text.trim()) return;
    await api.answer(props.question.id, text.trim());
    emit("answered");
}
</script>

<template>
    <div class="card question">
        <h3>The agent asks</h3>
        <div class="text">{{ question.text }}</div>
        <div class="choices">
            <button v-for="option in question.options" :key="option" class="btn" type="button" @click="answer(option)">{{ option }}</button>
        </div>
        <form class="add" @submit.prevent="answer(own)">
            <input v-model="own" class="field" placeholder="or answer in your own words" />
        </form>
    </div>
</template>
