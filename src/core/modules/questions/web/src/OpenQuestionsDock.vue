<script setup>
import {computed, ref} from "vue";
import {Btn, Icon, useWindow} from "@journal/window-kit";

// the card above the chat while questions wait: how many the agent asked, and the way to the questions window
const QUESTIONS_WINDOW = "questions.questions";
const context = useWindow();
const head = context.option("head");
const count = ref(0);
const words = computed(() => `Agent asked ${count.value} ${count.value === 1 ? "question" : "questions"}`);

async function load() {
    const answer = await context.read("question list");
    if (answer.ok) count.value = answer.value.rows.length;
}

context.follow(["question.*"], load);
load();
</script>

<template>
    <template v-if="head?.value ?? head">
        <Teleport :to="head?.value ?? head">
            <Icon name="question" class="open-questions-icon" />
            <span class="open-questions-text" data-open-questions>{{ words }}</span>
            <span class="open-questions-space" />
            <Btn small bordered data-open-questions-window @click="context.open(QUESTIONS_WINDOW)">Open</Btn>
        </Teleport>
    </template>
</template>

<style scoped>
.open-questions-icon {
    flex: none;
    color: var(--text-3);
}

.open-questions-text {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.open-questions-space {
    flex: 1;
}
</style>
