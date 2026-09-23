<script setup>
import {many, tint} from "../identity.js";
import {usePoll} from "../poll.js";
import {polled} from "../sync/polled.js";

usePoll(...polled.online);
usePoll(...polled.journals);
</script>

<template>
    <template v-if="many">
        <div class="identity-band" :style="{background: tint}" />
    </template>
</template>

<style scoped>
.identity-band {
    flex: none;
    height: 6px;
}
</style>
