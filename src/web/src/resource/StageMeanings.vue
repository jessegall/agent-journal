<script setup>
import {computed} from "vue";
import {api} from "../api/client.js";
import ChoiceList from "../kit/ChoiceList.vue";
import SectionHeading from "../kit/SectionHeading.vue";

const props = defineProps({board: {type: Object, required: true}});
const MEANINGS = [
    {value: "", label: "Nothing"},
    {value: "start", label: "Work starts"},
    {value: "review", label: "Waits for review"},
    {value: "done", label: "Done"},
];
const meanings = computed(() => props.board.data.meanings || {});
const stages = computed(() =>
    (props.board.data.stages || []).map((stage) => ({
        name: stage,
        choices: MEANINGS.map((m) => ({...m, current: (meanings.value[stage] || "") === m.value})),
    }))
);
const mark = (stage, meaning) => api.act("board", props.board.n, "meaning", {stage, meaning});
</script>

<template>
    <section class="block">
        <SectionHeading>What each stage means</SectionHeading>
        <template v-for="stage in stages" :key="stage.name">
            <div class="stage">
                <span class="name">{{ stage.name }}</span>
                <ChoiceList :choices="stage.choices" @pick="(meaning) => mark(stage.name, meaning)" />
            </div>
        </template>
    </section>
</template>

<style scoped>
.stage {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 4px 0;
}

.name {
    min-width: 110px;
    color: var(--text-2);
    font-size: 13px;
}
</style>
