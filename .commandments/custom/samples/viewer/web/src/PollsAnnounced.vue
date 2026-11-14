<script setup>
import {usePoll} from "../../kit/usePoll.js";
import {useWindow} from "@journal/window-kit";

const context = useWindow();
// @sin architecture_viewer_window_reads_outside_its_api
context.follow(["process.*"], () => context.read("process card 1"));
// @sin architecture_viewer_poll_in_a_window_that_follows_events
// @sin architecture_viewer_window_reads_outside_its_api
usePoll(() => context.read("process card 1"), () => true);
</script>

<template>
    <p>polls what it follows</p>
</template>
