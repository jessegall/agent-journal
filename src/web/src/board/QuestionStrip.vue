<script setup>
import {computed} from "vue";
import {api} from "../api/client.js";
import Btn from "../kit/Btn.vue";
import {word} from "../state/store.js";

const props = defineProps({question: {type: Object, required: true}});
const emit = defineEmits(["continue"]);
const options = computed(() => (Array.isArray(props.question.data.options) ? props.question.data.options : []));
const answer = (option) => api.act("question", props.question.n, word("question", "complete"), {how: option.title});
</script>

<template>
    <div class="strip">
        <span class="tag">Question</span>
        <span class="title">{{ question.title }}</span>
        <template v-for="option in options" :key="option.title">
            <Btn small @click="answer(option)">{{ option.title }}</Btn>
        </template>
        <Btn small @click="emit('continue')">Continue in New work</Btn>
    </div>
</template>

<style scoped>
.strip {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin: 12px 20px 0;
    padding: 8px 8px 8px 14px;
    border: 1px solid var(--border-2);
    border-radius: 9px;
    background: var(--raised);
    animation: strip-in 0.26s cubic-bezier(0.2, 0.9, 0.25, 1) both;
}

.tag {
    color: var(--accent-text);
    font-size: 11px;
    letter-spacing: 0.02em;
}

.title {
    flex: 1;
    min-width: 200px;
    color: var(--text);
    font-size: 13px;
}

@keyframes strip-in {
    from {
        opacity: 0;
        transform: translateY(-4px);
    }
}
</style>
