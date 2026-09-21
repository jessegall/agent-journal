<script setup>
import {ink, many, project, tint} from "../identity.js";
import {usePoll} from "../poll.js";
import {route} from "../route.js";
import {polled} from "../sync/polled.js";

usePoll(...polled.online);
usePoll(...polled.journals);
</script>

<template>
    <template v-if="many">
        <div class="identity-band" :style="{background: tint, color: ink}">{{ project }} · {{ route.env }}</div>
    </template>
</template>

<style scoped>
.identity-band {
    flex: none;
    padding: 3px 12px;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.02em;
    line-height: 16px;
    text-align: center;
}
</style>
