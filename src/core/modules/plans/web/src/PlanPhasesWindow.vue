<script setup>
import {InspectorPart, PlanPhases, useWindow} from "@journal/window-kit";
import TaskRow from "../../../tasks/web/src/TaskRow.vue";

// the phases of a plan with their tasks, each drawn as the Tasks window draws it
const view = useWindow();
const row = view.option("row");
const display = {number: true, reason: true};
</script>

<template>
    <InspectorPart title="Phases">
        <PlanPhases :phases="row.phases" :current-phase="row.current_phase">
            <template #task="{task}">
                <TaskRow :row="task" :display="display" />
            </template>
        </PlanPhases>
    </InspectorPart>
</template>
