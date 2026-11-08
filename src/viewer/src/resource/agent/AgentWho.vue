<script setup>
// the given name with the dot of its state, under it what it is with the plan allowance its program reports, and who started it
import AllowanceBar from "../../shell/AllowanceBar.vue";

defineProps({name: {type: String, required: true}, state: {type: String, required: true}, parts: {type: Array, required: true}, startedBy: {type: String, required: true}, windows: {type: Array, default: () => []}});
</script>

<template>
    <div class="who" data-agent-who>
        <h2 class="name"><i :class="['dot', state]" :data-agent-state="state" />{{ name }}</h2>
        <div class="identity"><p class="sub" data-agent-identity>{{ parts.join(" · ") }}</p><AllowanceBar :windows="windows" disabled /></div>
        <p class="sub" data-agent-started-by>Started by: {{ startedBy }}</p>
    </div>
</template>

<style scoped>
.who { padding: 14px 14px 12px; border-bottom: 1px solid var(--border-inner); }
.name { display: flex; align-items: center; gap: 9px; margin: 0; font-size: 18px; font-weight: 600; letter-spacing: -.01em; }
.dot { flex: none; width: 8px; height: 8px; border-radius: 50%; background: var(--accent); }
.dot.waiting { background: var(--paused, var(--text-3)); }
.dot.ended { background: var(--text-3); }
.sub { margin: 4px 0 0 17px; color: var(--text-3); font-size: 12.5px; line-height: 1.5; }
.identity { display: flex; flex-wrap: wrap; gap: 4px 14px; align-items: center; margin: 4px 0 0 17px; color: var(--text-3); font-size: 12.5px; }
.identity .sub { margin: 0; }
.identity + .sub { margin-top: 2px; }
</style>
