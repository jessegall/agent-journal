<script setup>
import {useWindow} from "@journal/window-kit";

// @righteous architecture_viewer_WindowDataThroughContextDetector
const answer = useWindow().read("task list");
// @sin architecture_viewer_WindowDataThroughContextDetector
const direct = fetch("/api/line");
</script>

<template>
    <p>{{ answer }} {{ direct }}</p>
</template>
