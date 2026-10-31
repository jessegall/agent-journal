<script setup>
import {onMounted, ref} from "vue";
import Btn from "../kit/Btn.vue";

// the page a phone opens to pair: a link's code pairs at once, otherwise the person types the code the computer shows
const props = defineProps({
    code: {type: String, default: ""},
    opened: {type: Function, required: true},
});

const typed = ref("");
const failure = ref("");

async function pair(code) {
    const answer = await fetch("/viewer/pair", {method: "POST", headers: {"Content-Type": "application/json"}, body: JSON.stringify({code: code.trim().toUpperCase()})});
    if (answer.ok) {
        props.opened();
        return;
    }
    failure.value = (await answer.json()).error;
}

onMounted(() => {
    if (props.code) pair(props.code);
});
</script>

<template>
    <div class="pair-page">
        <h1 class="pair-title">Pair this phone</h1>
        <p class="pair-text">Type the code the viewer on your computer shows under Phones, Pair a phone.</p>
        <form class="pair-form" @submit.prevent="pair(typed)">
            <input v-model="typed" class="pair-input" placeholder="ABCD-EFGH" autocapitalize="characters" autocomplete="one-time-code" />
            <Btn kind="primary" :disabled="!typed.trim()" @click="pair(typed)">Pair</Btn>
        </form>
        <template v-if="failure">
            <p class="pair-failure">{{ failure }}</p>
        </template>
    </div>
</template>

<style scoped>
.pair-page {
    display: flex;
    flex-direction: column;
    gap: 12px;
    max-width: 420px;
    margin: 20vh auto 0;
    padding: 0 16px;
}

.pair-title {
    margin: 0;
    font-size: 20px;
}

.pair-text,
.pair-failure {
    margin: 0;
    color: var(--text-2);
}

.pair-form {
    display: flex;
    gap: 8px;
}

.pair-input {
    flex: 1;
    min-width: 0;
    padding: 8px 10px;
    border: 1px solid var(--line);
    border-radius: 6px;
    color: var(--text);
    background: transparent;
    font-size: 16px;
    letter-spacing: 0.08em;
}
</style>
