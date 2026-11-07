<script setup>
import ResourceLinks from "../../../kit/ResourceLinks.vue";
import {peekRef} from "../../route.js";

defineProps({model: {type: String, required: true}, id: {type: Number, required: true}, read: {type: Function, required: true}});
const open = (target) => peekRef(`${target.table}:${target.id}`);
</script>

<template>
    <div class="document-tab" data-document-links>
        <ResourceLinks :model="model" :id="id" :read="read" link-attribute="data-text-link" empty="No links" @open="open" />
    </div>
</template>

<style scoped>
.document-tab {display: flex; flex: 1; flex-direction: column; align-items: flex-start; gap: 6px; overflow-y: auto; padding: 18px 24px;}
</style>
