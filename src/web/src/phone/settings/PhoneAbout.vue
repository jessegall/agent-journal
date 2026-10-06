<script setup>
import {onMounted} from "vue";
import {useUpdates} from "../../composables/updates.js";
import TextDisplay from "../../kit/TextDisplay.vue";
import Cell from "../kit/Cell.vue";
import CellGroup from "../kit/CellGroup.vue";

const {about, error, status, update, start} = useUpdates();

onMounted(start);
</script>

<template>
    <template v-if="error">
        <p class="about-error">{{ error }}</p>
    </template>
    <template v-if="about">
        <CellGroup>
            <Cell :label="`Agent journal ${about.version}`" :sub="status ? status.text : ''" still />
            <template v-if="status && status.update">
                <Cell :label="`Update to ${about.latest}`" tone="accent" :chevron="false" @pick="update" />
            </template>
        </CellGroup>
        <h2 class="about-head">What changed</h2>
        <TextDisplay class="about-log" :text="about.changelog" />
    </template>
</template>

<style scoped>
.about-error {
    color: var(--danger);
}

.about-head {
    margin: 22px 4px 7px;
    color: var(--text-3);
    font-size: 0.8125rem;
    font-weight: 600;
}

.about-log {
    font-size: 0.9375rem;
}
</style>
