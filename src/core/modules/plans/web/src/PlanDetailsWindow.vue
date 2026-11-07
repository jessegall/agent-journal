<script setup>
import {PlanDetails, useWindow} from "@journal/window-kit";

// the state, reason, progress, delegation and brief of a plan, drawn in its inspector from the row it is given
const view = useWindow();
const row = view.option("row");
</script>

<template>
    <PlanDetails :plan="row" />
</template>
