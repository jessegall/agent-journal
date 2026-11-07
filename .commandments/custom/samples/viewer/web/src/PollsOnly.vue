<script setup>
import {usePoll} from "../../kit/usePoll.js";
import {useWindow} from "@journal/window-kit";

const context = useWindow();
// @righteous architecture_viewer_poll_in_a_window_that_follows_events
usePoll(() => context.read("usage show"), () => true, 10000);
</script>

<template>
    <p>polls what no event announces</p>
</template>
