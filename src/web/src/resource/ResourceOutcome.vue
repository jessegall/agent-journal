<script setup>
import {label} from "../domain/tables.js";
import TextDisplay from "../kit/TextDisplay.vue";
import ResourceBlock from "./ResourceBlock.vue";

defineProps({resource: {type: Object, required: true}});
</script>

<template>
    <ResourceBlock :heading="label(resource.table, 'outcome', 'How it ended')">
        <TextDisplay :text="resource.outcome" />
    </ResourceBlock>
</template>
