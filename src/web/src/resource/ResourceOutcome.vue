<script setup>
import {label, word} from "../domain/spec.js";
import {computed} from "vue";
import TextDisplay from "../kit/TextDisplay.vue";
import ResourceBlock from "./ResourceBlock.vue";
import {age} from "../format/time.js";

const props = defineProps({resource: {type: Object, required: true}, documented: {type: Boolean, default: false}});
const heading = computed(() =>
    props.documented
        ? "Note when marked final"
        : label(
              props.resource.type,
              "outcome",
              word(props.resource.type, "complete").replace(/^\w/, (c) => c.toUpperCase())
          )
);
</script>

<template>
    <ResourceBlock :heading="heading">
        <TextDisplay :text="resource.outcome || age(resource.completed)" />
    </ResourceBlock>
</template>
