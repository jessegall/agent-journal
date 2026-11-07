<script setup>
import {Btn} from "@journal/window-kit";
defineProps({row: {type: Object, required: true}, share: {type: Number, required: true}, disabled: Boolean});
defineEmits(["share", "save", "back", "out"]);
</script>

<template>
    <section class="program" :data-split-program="row.id">
        <strong>{{ row.title }}</strong>
        <label class="share">Share <input type="range" min="0" max="100" step="5" :value="share" :aria-label="`${row.title} share`" :disabled="disabled" @input="$emit('share', Number($event.target.value))" @change="$emit('save')" /><output>{{ share }}%</output></label>
        <small>{{ row.recent }} recent worker tasks · {{ row.helpers_recent }} recent helper tasks</small>
        <template v-for="line in row.windows" :key="line"><small>{{ line }}</small></template>
        <template v-if="!row.is_ready"><p>{{ row.line }}<template v-if="row.ends_at"> · Until {{ row.ends_at }}</template></p></template>
        <template v-if="row.outage && row.outage_reason !== row.line"><p>{{ row.outage_reason }} · Until {{ row.outage_ends_at }}</p></template>
        <div class="actions">
            <template v-if="row.outage"><Btn small :disabled="disabled" @click="$emit('back')">Back now</Btn></template>
            <Btn small :disabled="disabled" @click="$emit('out')">Mark out</Btn>
        </div>
    </section>
</template>

<style scoped>
.program {display: flex; flex-direction: column; gap: 6px; padding: 10px 0; border-bottom: 1px solid var(--border);}
.share {display: flex; align-items: center; gap: 8px;}
input {min-width: 0; flex: 1;}
output {min-width: 36px; text-align: right;}
small {color: var(--text-3);}
p {margin: 0;}
.actions {display: flex; gap: 6px;}
</style>
