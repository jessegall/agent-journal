<script setup>
// The Stop and Watch buttons of a running process, shared by the outputs list and the output window
import {useWindow} from "@journal/window-kit";

const props = defineProps({processId: {type: Number, required: true}});
const context = useWindow();
const press = (action) => context.run(`output ${action} ${props.processId}`);
</script>

<template>
    <button class="stop" type="button" @click="press('stop')">Stop</button>
    <button class="watch" type="button" @click="press('watch')">Watch</button>
</template>
