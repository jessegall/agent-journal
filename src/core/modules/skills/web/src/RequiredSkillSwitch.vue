<script setup>
defineProps({folder: {type: String, required: true}, required: Boolean, busy: Boolean});
const emit = defineEmits(["change"]);
</script>

<template>
    <button type="button" role="switch" :aria-checked="required" :aria-label="`${required ? 'Stop requiring' : 'Require'} ${folder} at the start`" :disabled="busy" :class="['required-switch', {on: required}]" @click="emit('change', !required)"><span /></button>
</template>

<style scoped>
.required-switch { flex:none; width:28px; height:16px; padding:2px; border:0; border-radius:20px; background:var(--text-4); cursor:pointer; }
.required-switch span { display:block; width:12px; height:12px; border-radius:50%; background:#fff; transition:transform .15s; }
.required-switch.on { background:var(--accent); }
.required-switch.on span { transform:translateX(12px); }
.required-switch:disabled { opacity:.5; cursor:wait; }
@media(max-width:700px) { .required-switch { width:40px; height:24px; } .required-switch span { width:20px; height:20px; } .required-switch.on span { transform:translateX(16px); } }
</style>
