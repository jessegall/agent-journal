<script setup>
import {many, tint} from "../identity.js";
import {usePoll} from "../poll.js";
import {store} from "../state/store.js";
import {polled} from "../sync/polled.js";

usePoll(...polled.online);
usePoll(...polled.journals);
</script>

<template>
    <template v-if="many">
        <div :class="['identity-band', {thin: store.wide}]" :style="{background: tint}" />
    </template>
</template>

<style scoped>
.identity-band {
    flex: none;
    height: 6px;
    transition: height 0.26s var(--ease);
}

.identity-band.thin {
    height: 2px;
}
</style>
