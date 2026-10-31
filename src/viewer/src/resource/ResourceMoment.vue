<script setup>
import {computed} from "vue";
import {meta} from "../domain/tables.js";
import {conditionText, momentText} from "../domain/memoryTriggers.js";
import ResourceBlock from "./ResourceBlock.vue";

const props = defineProps({resource: {type: Object, required: true}});
const noun = computed(() => meta(props.resource.table).title.toLowerCase());
const condition = computed(() => conditionText(props.resource.condition));
</script>

<template>
    <ResourceBlock heading="Repeated on an event">
        <dl class="moment">
            <dt>Event</dt>
            <dd>{{ momentText(resource.trigger) }}</dd>
            <template v-if="condition">
                <dt>Only if</dt>
                <dd>{{ condition }}</dd>
            </template>
            <dt>After it is repeated</dt>
            <dd>{{ resource.is_single_use ? `The ${noun} is struck` : `The ${noun} is kept` }}</dd>
        </dl>
    </ResourceBlock>
</template>

<style scoped>
.moment {
    margin: 0;
}

.moment dt {
    color: var(--text-3);
    font-size: 12px;
}

.moment dd {
    margin: 0 0 8px;
}
</style>
