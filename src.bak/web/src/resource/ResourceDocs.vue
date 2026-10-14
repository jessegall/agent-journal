<script setup>
import SectionHeading from "../kit/SectionHeading.vue";
import ResourceCard from "./ResourceCard.vue";
import {peek} from "../route.js";

defineProps({docs: {type: Array, required: true}});
</script>

<template>
    <section class="linked-docs">
        <SectionHeading class="linked-docs-head">Related documents</SectionHeading>
        <div class="linked-docs-cards">
            <template v-for="d in docs" :key="d.ref">
                <ResourceCard :resource="d" @click="peek('doc', d.n)" />
            </template>
        </div>
    </section>
</template>

<style scoped>
.linked-docs {
    margin: 18px 0 0;
}

.linked-docs-head {
    margin: 0 0 8px;
    color: var(--text-3);
    font-size: 11px;
    font-weight: 500;
    letter-spacing: 0.04em;
    text-transform: uppercase;
}

.linked-docs-cards {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
    gap: 10px;
}
</style>
