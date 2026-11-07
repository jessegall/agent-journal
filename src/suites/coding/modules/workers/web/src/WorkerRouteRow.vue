<script setup>
import {Btn} from "@journal/window-kit";
defineProps({row: {type: Object, required: true}, count: {type: Number, required: true}, disabled: Boolean});
defineEmits(["move", "delete"]);
</script>

<template>
    <section class="route" :data-split-route="row.id">
        <strong>{{ row.position }}. {{ row.program || 'Any program' }} · {{ row.tier || 'Profile tier' }}</strong>
        <p>{{ row.tags.join(', ') || 'Any tags' }}<template v-if="row.complexity_from !== null || row.complexity_to !== null"> · Complexity {{ row.complexity_from ?? 1 }} to {{ row.complexity_to ?? 5 }}</template></p>
        <template v-if="row.strict"><small>Waits for this program when it is out.</small></template>
        <template v-if="row.status === 'gone'"><small>This program was removed. This route matches nothing.</small></template>
        <div class="actions">
            <Btn small :disabled="disabled || row.position === 1" @click="$emit('move', row.position - 1)">Move up</Btn>
            <Btn small :disabled="disabled || row.position === count" @click="$emit('move', row.position + 1)">Move down</Btn>
            <Btn small :disabled="disabled" @click="$emit('delete')">Delete</Btn>
        </div>
    </section>
</template>

<style scoped>
.route {display: flex; flex-direction: column; gap: 6px; padding: 10px 0; border-bottom: 1px solid var(--border);}
p {margin: 0;}
small {color: var(--text-3);}
.actions {display: flex; flex-wrap: wrap; gap: 6px;}
</style>
