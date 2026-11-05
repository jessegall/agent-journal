<script setup>
import Icon from "../kit/Icon.vue";
defineProps({icon: {type: String, required: true}, count: {type: Number, default: null}});
</script>
<template><h2 class="band"><Icon :name="icon" :size="12" /><slot /><template v-if="count !== null"><span>{{ count }}</span></template></h2></template>
<style scoped>
.band { display:flex; align-items:center; gap:7px; height:28px; margin:0; padding:0 14px; background:var(--side); border-bottom:1px solid var(--border); color:var(--text-2); font-size:11.5px; font-weight:500; letter-spacing:.03em; }
.band svg { color:var(--text-3); }
.band span { margin-left:auto; color:var(--text-3); font-size:11px; font-variant-numeric:tabular-nums; }
</style>
