<script setup>
import BigTitle from "../kit/BigTitle.vue";
import ItemScreen from "../kit/ItemScreen.vue";

defineProps({title: {type: String, required: true}, line: {type: String, default: ""}, back: {type: String, default: ""}});
const emit = defineEmits(["back"]);
</script>

<template>
    <ItemScreen :title="title" :about="title" :back="back" @back="emit('back')">
        <template #end><slot name="end" /></template>
        <BigTitle :title="title" />
        <template v-if="line">
            <p class="page-line">{{ line }}</p>
        </template>
        <slot />
        <template #primary><slot name="primary" /></template>
    </ItemScreen>
</template>

<style scoped>
.page-line {
    margin: 0 0 14px;
    color: var(--text-3);
    font-size: 0.9375rem;
    text-wrap: pretty;
}
</style>
