<script setup>
import {computed} from "vue";
import {Skeleton, WindowRoom, useWindow} from "@journal/window-kit";
import QuestionSection from "./QuestionSection.vue";
import QuestionWindowCard from "./QuestionWindowCard.vue";
import {isOpen} from "./questionWords.js";

// the Questions window: two bars, Open (no count: the pane tab counts the open questions) and Done (answered and closed, with its count), both starting open
const view = useWindow();
view.state.tab = view.shared ? "shared" : "list";
const key = view.shared ? `question.${view.shared.id}` : "questions";
const {rows, failure, loaded, load} = view.props[key];
if (view.shared) view.reload(key);
const open = computed(() => rows.value.filter(isOpen));
const done = computed(() => rows.value.filter((row) => !isOpen(row)));
</script>

<template>
    <WindowRoom padding="0">
        <div class="questions" data-questions>
            <p v-if="failure" class="note failure" role="alert">{{ failure }}</p>
            <Skeleton v-if="!loaded" shape="rows" />
            <template v-else>
                <QuestionSection title="Open">
                    <template v-for="row in open" :key="row.id"><QuestionWindowCard :row="row" @changed="load" /></template>
                    <p v-if="!open.length" class="note" data-questions-none>None</p>
                </QuestionSection>
                <QuestionSection v-if="done.length" title="Done" :count="done.length">
                    <template v-for="row in done" :key="row.id"><QuestionWindowCard :row="row" /></template>
                </QuestionSection>
            </template>
        </div>
    </WindowRoom>
</template>

<style scoped>
.questions {
    padding-bottom: 12px;
}

.note {
    margin: 0;
    padding: 0 var(--inset);
    color: var(--text-3);
    font-size: 12.5px;
}

.failure {
    color: var(--danger);
}
</style>
