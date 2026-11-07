<script setup>
import {ref} from "vue";
import {useWindow} from "@journal/window-kit";
import {useOutputPages} from "../../../../viewer/src/composables/outputPages.js";
import OutputLines from "../../../../viewer/src/kit/OutputLines.vue";

const props = defineProps({call: {type: Number, required: true}});
const emit = defineEmits(["command"]);
const view = useWindow();
const pages = useOutputPages((words) => view.readKey(`terminal-output.${props.call}`, words[3] ? {[words[3].slice(2)]: words[4]} : {}), () => props.call);
const failure = ref("");
const loaded = ref(false);
pages.newest().then((answer) => {
    failure.value = answer.ok ? "" : answer.error;
    if (answer.ok && answer.value.command) emit("command", answer.value.command);
    loaded.value = true;
});
</script>

<template>
    <template v-if="failure"><p role="alert">{{ failure }}</p></template>
    <template v-else-if="loaded"><OutputLines class="terminal-output" :lines="pages.lines.value" empty="No output recorded." data-terminal-output @older="pages.loadEarlier" /></template>
</template>

<style scoped>
.terminal-output { max-height: 240px; margin: 4px 0 8px 18px; color: var(--text-3); white-space: pre-wrap; overflow-wrap: anywhere; }
</style>
