<script setup>
import {useWindow} from "@journal/window-kit";

// @righteous architecture_viewer_window_data_outside_context
const answer = useWindow().read("task list");
// @sin architecture_viewer_window_data_outside_context
// @sin architecture_viewer_request_outside_the_funnel
// @sin architecture_viewer_window_reads_outside_its_api
const direct = fetch("/api/line");
</script>

<template>
    <p>{{ answer }} {{ direct }}</p>
</template>
