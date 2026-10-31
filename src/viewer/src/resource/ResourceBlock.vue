<script setup>
import SectionHeading from "../kit/SectionHeading.vue";

defineProps({heading: {type: String, default: ""}});
</script>

<template>
    <section class="block">
        <template v-if="heading">
            <SectionHeading>{{ heading }}</SectionHeading>
        </template>
        <slot />
    </section>
</template>

<style scoped>
.block {
    margin-top: 16px;
}

.block h3 {
    margin: 0 0 4px;
}
</style>
