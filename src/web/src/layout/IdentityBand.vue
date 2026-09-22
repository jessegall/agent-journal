<script setup>
import {many, project, tint} from "../identity.js";
import {usePoll} from "../poll.js";
import {route} from "../route.js";
import {polled} from "../sync/polled.js";

usePoll(...polled.online);
usePoll(...polled.journals);
</script>

<template>
    <template v-if="many">
        <div class="identity-band" :style="{background: tint}">
            <span class="identity-notch">{{ project }} · {{ route.env }}</span>
        </div>
    </template>
</template>

<style scoped>
.identity-band {
    flex: none;
    display: flex;
    justify-content: center;
    height: 22px;
}

.identity-notch {
    display: inline-flex;
    align-items: center;
    height: 100%;
    padding: 0 16px;
    border-radius: 0 0 10px 10px;
    background: #0b0c0e;
    color: #fff;
    font-size: 11.5px;
    font-weight: 600;
    letter-spacing: 0.02em;
    white-space: nowrap;
}
</style>
