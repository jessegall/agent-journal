<script setup>
import {computed} from "vue";
import {sentence} from "../../../triggers/web/src/triggerWords.js";
const props = defineProps({trigger: {type: Object, required: true}, busy: Boolean});
const emit = defineEmits(["edit", "run"]);
const summary = computed(() => sentence(props.trigger));
</script>

<template>
    <article :class="['skill-trigger-card', {paused: trigger.paused_at}]">
        <p>{{ summary }}</p>
        <template v-if="trigger.needs_enabling"><p class="waiting">An agent made this trigger. It does nothing until you turn it on.</p></template>
        <footer><span>{{ trigger.fired_count ? `Fired ${trigger.fired_count} times` : 'Not fired yet' }}</span><template v-if="trigger.paused_at"><span>Paused</span></template><span class="push" />
            <button type="button" :disabled="busy" @click="emit('edit', trigger)">Edit</button>
            <template v-if="trigger.needs_enabling"><button type="button" :disabled="busy" @click="emit('run', ['trigger', 'enable', String(trigger.id)])">Turn it on</button></template>
            <template v-else><button type="button" :disabled="busy" :aria-label="trigger.paused_at ? 'Resume this trigger' : 'Pause this trigger'" @click="emit('run', ['trigger', 'pause', String(trigger.id), ...(trigger.paused_at ? ['--off'] : [])])">{{ trigger.paused_at ? 'Resume' : 'Pause' }}</button></template>
        </footer>
    </article>
</template>

<style scoped>
.skill-trigger-card { padding:14px; border:1px solid var(--border-2); border-radius:8px; font-size:12px; line-height:1.6; background:var(--bg); }
p { margin:0; overflow-wrap:anywhere; }
footer { display:flex; flex-wrap:wrap; align-items:center; gap:8px; margin-top:10px; color:var(--text-3); font-size:11px; }
.push { flex:1; }
button { padding:4px 8px; border:1px solid var(--border-2); border-radius:5px; background:var(--bg); color:var(--text-2); font:inherit; cursor:pointer; }
.waiting { margin-top:8px; color:var(--orange, #b57828); }
.paused { opacity:.7; }
</style>
