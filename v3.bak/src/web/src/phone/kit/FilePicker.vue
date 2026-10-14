<script setup>
import {ref} from "vue";

defineProps({
    label: {type: String, required: true},
    multiple: {type: Boolean, default: false},
});
const emit = defineEmits(["pick"]);
const input = ref(null);

function chosen(event) {
    const files = [...event.target.files];
    event.target.value = "";
    if (files.length) emit("pick", files);
}

defineExpose({open: () => input.value.click()});
</script>

<template>
    <input ref="input" type="file" hidden :multiple="multiple" :aria-label="label" @change="chosen" />
</template>
