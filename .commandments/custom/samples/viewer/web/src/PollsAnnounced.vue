<script setup>
import {usePoll} from "../../kit/usePoll.js";
import {useWindow} from "@journal/window-kit";

const context = useWindow();
context.follow(["process.*"], () => context.read("process card 1"));
// @sin architecture_viewer_poll_in_a_window_that_follows_events
usePoll(() => context.read("process card 1"), () => true);
</script>

<template>
    <p>polls what it follows</p>
</template>
