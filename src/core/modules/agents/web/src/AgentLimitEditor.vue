<script setup>
defineProps({row: {type: Object, required: true}, pending: Boolean, readOnly: Boolean, environment: {type: String, required: true}});
const emit = defineEmits(["change"]);
</script>

<template>
    <p>How many may run at once, and how many may be kept.</p>
    <div class="edit-row" :data-edit-type="row.key">
        <template v-for="field in [{name: 'Most running', value: row.run_limit, source: row.run_source, kind: 'run'}, {name: 'Most kept', value: row.kept_limit, source: row.kept_source, kind: 'kept'}]" :key="field.kind">
            <label>
                {{ field.name }}<span class="stepper"><button type="button" :disabled="pending || readOnly || field.value === 0" @click="emit('change', field.kind, field.value - 1)">−</button><input type="number" min="0" :value="field.value" :disabled="pending || readOnly" :data-agent-limit-input="field.kind" @change="emit('change', field.kind, $event.target.value)" /><button type="button" :disabled="pending || readOnly" @click="emit('change', field.kind, field.value + 1)">+</button></span>
                <template v-if="field.value === 0"><small>{{ field.kind === 'run' ? 'None can start' : 'Any number' }}</small></template><template v-else-if="field.source === `environment ${environment}`"><small>Changed for {{ environment }}</small></template>
            </label>
        </template>
    </div>
</template>

<style scoped>
p { color: var(--text-3); margin: 0 0 12px; }
.edit-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; padding: 12px 0; border-bottom: 1px solid var(--border); margin-bottom: 12px; }
small { display: block; color: var(--text-3); margin-top: 4px; }
.stepper { display: flex; height: 32px; margin-top: 4px; }
.stepper button, .stepper input { width: 32px; border: 1px solid var(--border); background: var(--raised); color: var(--text); text-align: center; }
.stepper input { width: 48px; }
@media (max-width: 600px) { .stepper { height: 44px; } }
</style>
