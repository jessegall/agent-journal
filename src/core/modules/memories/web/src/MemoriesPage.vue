<script setup>
import {WindowRoom, useWindow} from "@journal/window-kit";
import MemoryBrowser from "./MemoryBrowser.vue";

// the memories of the environment the page is open in: a window reads only its own environment
const context = useWindow();
</script>

<template>
    <WindowRoom>
        <MemoryBrowser :environment="context.environment" />
    </WindowRoom>
</template>
