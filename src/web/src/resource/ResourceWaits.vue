<script setup>
import {parkedFor} from "../domain/records.js";
import {peek} from "../route.js";

defineProps({resource: {type: Object, required: true}, blocked: {type: String, default: ""}, waits: {type: Array, required: true}});
</script>

<template>
    <p class="waits">
        <template v-if="blocked">Blocked: {{ blocked }}</template>
        <template v-if="parkedFor(resource)">Paused: {{ parkedFor(resource) }}</template>
        <template v-if="waits.length">
            Waits on
            <template v-for="(ref, i) in waits" :key="ref">
                <button type="button" class="wait" @click="peek(ref.split(':')[0], Number(ref.split(':')[1]))">
                    {{ ref.replace("todo:", "to-do ").replace("plan:", "plan ") }}
                </button>
                {{ i < waits.length - 1 ? ", " : "" }}
            </template>
        </template>
    </p>
</template>

<style scoped>
.wait {
    padding: 0;
    border: 0;
    background: none;
    color: var(--accent-text);
    font: inherit;
    cursor: pointer;
}

.waits {
    margin: 10px 0 0;
    color: var(--blocking);
    font-size: 12.5px;
}
</style>
