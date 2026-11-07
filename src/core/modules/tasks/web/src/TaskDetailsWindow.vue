<script setup>
import {computed, ref, watch} from "vue";
import {TaskDetails, peekRef, useWindow} from "@journal/window-kit";

// the plan place, status, priority and complexity of a task; priority and complexity are edited through task edit
const view = useWindow();
const row = view.option("row");
const {data: graph} = view.props.graph;
const place = ref(null);
const refusal = ref("");

async function loadPlace() {
    const answer = await view.read(["plan", "place", String(row.value.id)]);
    place.value = answer.ok ? answer.value : null;
}

async function change(field, value) {
    const answer = await view.run(["task", "edit", String(row.value.id), `--${field}`, String(value)]);
    refusal.value = answer.ok ? "" : answer.error;
}

watch(computed(() => row.value.id), loadPlace, {immediate: true});
</script>

<template>
    <TaskDetails
        :task="row"
        :place="place"
        :graph="graph"
        :refusal="refusal"
        @priority="change('priority', $event)"
        @complexity="change('complexity', $event)"
        @select="(id) => peekRef(`tasks:${id}`)"
    />
</template>
