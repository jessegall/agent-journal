<script setup>
import {onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import PhonePage from "./PhonePage.vue";
import PhoneTerm from "./PhoneTerm.vue";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const text = ref("Loading…");

onMounted(async () => {
    text.value = (await api.diagnostics().catch((error) => ({log: error.message}))).log || "Nothing is logged yet.";
});
</script>

<template>
    <PhonePage title="Developer error log" line="Slow requests and errors, saved in .journal/runtime/diagnostics.log" :back="back" @back="emit('back')">
        <PhoneTerm :text="text" />
    </PhonePage>
</template>
