<script setup>
import MarkIcon from "../kit/MarkIcon.vue";
import {vContext} from "../../kit/vContext.js";

// one page in the sidebar: its mark and name, the count beside it when it has one; a right click opens its menu
defineProps({page: {type: Object, required: true}, active: Boolean, address: {type: String, required: true}, count: {type: Number, default: 0}, place: {type: Function, required: true}});
const emit = defineEmits(["go"]);
</script>

<template>
    <a v-context="place" :class="['item', {active}]" :title="page.title" :href="address" :data-sidebar-window="page.name" :aria-disabled="Boolean(page.unavailable_reason)" @click="emit('go', $event)">
        <MarkIcon :name="page.icon || 'window'" /><span class="item-title">{{ page.title }}</span>
        <template v-if="count">
            <span class="item-count">{{ count }}</span>
        </template>
    </a>
</template>
