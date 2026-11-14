<script setup>
import Btn from "../src/kit/Btn.vue";

defineProps({more: Boolean, loading: Boolean, failure: {type: String, default: ""}, label: {type: String, default: "More items"}});
defineEmits(["more"]);
</script>

<template>
    <template v-if="failure || more"><div class="more-items">
        <template v-if="failure"><p role="alert">{{ failure }}</p></template>
        <template v-if="more"><Btn small data-page-more :disabled="loading" @click="$emit('more')">{{ loading ? "Loading" : label }}</Btn></template>
    </div></template>
</template>

<style scoped>
.more-items {display: flex; flex-direction: column; align-items: flex-start; gap: 8px;}
p {color: var(--danger-text); font-size: 13px;}
</style>
