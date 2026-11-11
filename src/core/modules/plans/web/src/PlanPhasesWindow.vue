<script setup>
import {InspectorPart, PlanPhases, useWindow} from "@journal/window-kit";
import TaskRow from "../../../tasks/web/src/TaskRow.vue";

// the phases of a plan with their tasks, each drawn as the Tasks window draws it, under a line on how each checkpoint stands
const view = useWindow();
const row = view.option("row");
const display = {number: true, reason: true};
</script>

<template>
    <InspectorPart title="Phases">
        <template v-if="row.checkpoint_lines?.length">
            <ul class="checkpoint-lines">
                <template v-for="line in row.checkpoint_lines" :key="line">
                    <li>{{ line }}</li>
                </template>
            </ul>
        </template>
        <PlanPhases :phases="row.phases" :current-phase="row.current_phase">
            <template #task="{task}">
                <TaskRow :row="task" :display="display" />
            </template>
        </PlanPhases>
    </InspectorPart>
</template>

<style scoped>
.checkpoint-lines {
    margin: 0 0 8px;
    padding: 0;
    list-style: none;
    font-size: 12px;
    opacity: 0.8;
}
</style>
