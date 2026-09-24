<script setup>
import {many, tint} from "../identity.js";
import {usePoll} from "../poll.js";
import {polled} from "../sync/polled.js";
import {drawnWide} from "../platform/fullscreen.js";

usePoll(...polled.online);
usePoll(...polled.journals);
</script>

<template>
    <template v-if="many">
        <div :class="['identity-band', {hidden: drawnWide}]" :style="{background: tint}" />
    </template>
</template>

<style scoped>
.identity-band {
    flex: none;
    height: 6px;
    transition: height 0.26s var(--ease);
}

.identity-band.hidden {
    height: 0;
}
</style>
