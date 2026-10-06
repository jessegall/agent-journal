<script setup>
import {ago} from "../format/time.js";
import {useFloatingChat} from "../composables/floatingChat.js";
import {peek} from "../route.js";
import {store} from "../state/store.js";
import Btn from "../kit/Btn.vue";

const props = defineProps({answer: {type: Object, required: true}, about: {type: Object, required: true}});
const {openChat} = useFloatingChat();

function writeMore() {
    store.quoting = {text: props.about.title, ref: props.about.ref};
    openChat();
}
</script>

<template>
    <div class="chosen">
        <p class="line">
            You chose
            <b>{{ answer.label }}</b>
        </p>
        <p class="note">
            <template v-if="answer.sent">
                Sent as your message {{ answer.sent.n }}, {{ ago(answer.sent.created) }}: “{{ answer.say }}” ·
                <button type="button" class="link" @click="peek('message', answer.sent.n)">Open the message</button>
            </template>
            <template v-else>{{ answer.result }}</template>
        </p>
        <p class="note">Not chosen: {{ answer.passed.join(", ") }}</p>
        <div>
            <Btn small @click="writeMore">Write more about this</Btn>
        </div>
    </div>
</template>

<style scoped>
.chosen {
    display: flex;
    flex-direction: column;
    gap: 4px;
}

.line {
    margin: 0;
    color: var(--text);
    font-size: 14px;
}

.note {
    margin: 0;
    color: var(--text-3);
    font-size: 12px;
}

.link {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}
</style>
