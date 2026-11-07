<script setup>
import {InspectorPart, PlanPhases, peekRef, useWindow} from "@journal/window-kit";

// the phases of a plan with their tasks; a task opens in the inspector
const view = useWindow();
const row = view.option("row");
</script>

<template>
    <InspectorPart title="Phases">
        <PlanPhases :phases="row.phases" :current-phase="row.current_phase" @select="(id) => peekRef(`tasks:${id}`)" />
    </InspectorPart>
</template>
