<script setup>
import {computed} from "vue";

// the one line under the agent bar, as version 4's information bar drew it: the program, the state and how long the agent has run
const props = defineProps({agent: {type: Object, default: null}, now: {type: Number, default: () => Date.now()}});
const running = computed(() => Boolean(props.agent) && !props.agent.ended_at);
const uptime = computed(() => {
    const started = props.agent?.process_started_at ? new Date(props.agent.process_started_at).getTime() : 0;
    const minutes = started ? Math.max(0, Math.floor((props.now - started) / 60000)) : 0;
    return minutes >= 60 ? `${Math.floor(minutes / 60)}h ${minutes % 60}m` : `${minutes}m`;
});
</script>

<template>
    <div class="information" data-information-bar>
        <template v-if="agent">
            <span>{{ agent.program }}</span>
            <span>{{ running ? "Working" : "Ended" }}</span>
            <span>{{ uptime }} up</span>
        </template>
    </div>
</template>

<style scoped>
.information {
    display: flex;
    gap: 16px;
    align-items: center;
    min-height: 30px;
    padding: 0 16px;
    border-bottom: 1px solid var(--border);
    color: var(--text-3);
    font-size: 12px;
}
</style>
