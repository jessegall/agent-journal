<script setup>
import {computed} from "vue";
import OptionsPicker from "../resource/OptionsPicker.vue";
import {rows} from "../sync/rows.js";

const props = defineProps({turn: {type: Object, required: true}});
const question = computed(() => rows("questions").find((q) => q.id === props.turn.question.id) || {table: "questions", ...props.turn.question, text: props.turn.text});
</script>

<template>
    <div class="turn-question">
        <OptionsPicker :question="question" />
    </div>
</template>

<style scoped>
.turn-question {
    width: 100%;
}

.thread-context {
    margin: 4px 0 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
