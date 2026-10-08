<script setup>
import {onMounted, ref} from "vue";
import {api} from "../../api/client.js";
import {DIAGNOSTICS_LINE} from "../../domain/settingsCatalog.js";
import PhonePage from "./PhonePage.vue";
import PhoneTerm from "./PhoneTerm.vue";
import Skeleton from "../../kit/Skeleton.vue";

defineProps({target: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
const text = ref("");
const loaded = ref(false);

onMounted(async () => {
    text.value = (await api.diagnostics().catch((error) => ({log: error.message}))).log || "Nothing is logged yet.";
    loaded.value = true;
});
</script>

<template>
    <PhonePage title="Developer error log" :line="DIAGNOSTICS_LINE" :back="back" @back="emit('back')">
        <template v-if="loaded">
            <PhoneTerm :text="text" />
        </template>
        <template v-else>
            <Skeleton shape="text" label="Loading the error log" />
        </template>
    </PhonePage>
</template>
