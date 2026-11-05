<script setup>
import Btn from "../../kit/Btn.vue";
import {peekRef} from "../../route.js";

// what a document links to
defineProps({links: {type: Array, required: true}});
const targetRef = (link) => `${link.target_model}:${link.target_id}`;
</script>

<template>
    <div class="document-tab" data-document-links>
        <template v-if="links.length">
            <template v-for="link in links" :key="link.id">
                <Btn variant="text" data-text-link @click="peekRef(targetRef(link))">{{ link.link_type }} {{ targetRef(link) }}</Btn>
            </template>
        </template>
        <template v-else>
            <p class="document-none">No links</p>
        </template>
    </div>
</template>

<style scoped>
.document-tab {
    display: flex;
    flex: 1;
    flex-direction: column;
    gap: 6px;
    align-items: flex-start;
    overflow-y: auto;
    padding: 18px 24px;
}

.document-none {
    margin: 0;
    color: var(--text-3);
    font-size: 12.5px;
}
</style>
