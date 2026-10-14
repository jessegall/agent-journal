<script setup>
const props = defineProps({agent: Object});
const words = (state) => state.replaceAll("_", " ");
const ago = (at) => {
    const seconds = (Date.now() - new Date(at).getTime()) / 1000;
    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    return `${Math.floor(seconds / 3600)} h ago`;
};
const detail = (agent) => Object.entries(agent.data || {}).filter(([k]) => k !== "resume").map(([k, v]) => `${k.replaceAll("_", " ")} ${v}`).join(", ");
</script>

<template>
    <div class="card">
        <h3>{{ agent.provider }} · {{ agent.session.slice(0, 8) }}</h3>
        <div class="line"><span>State</span><span :class="['pill', agent.state]">{{ words(agent.state) }}</span></div>
        <div v-if="detail(agent)" class="line"><span>On</span><b>{{ detail(agent) }}</b></div>
        <div class="line"><span>May</span><b>{{ agent.allows.map(words).join(", ") || "read and run" }}</b></div>
        <div class="line"><span>Context mark</span><b>{{ agent.context_mark ? agent.context_mark + "%" : "none yet" }}</b></div>
        <div class="line"><span>Last seen</span><b>{{ ago(agent.updated_at) }}</b></div>
    </div>
</template>
