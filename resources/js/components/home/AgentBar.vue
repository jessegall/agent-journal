<script setup lang="ts">
/**
 * Version 5's agent bar (shell/AgentBar.vue) under decision D3: 54 px, the 8 px state dot and the state word of the
 * agent chosen in the chat. The bar hears of the agent through its live session, so a named agent is Working and an
 * agent with no session reads Idle.
 */
defineProps<{ agentName?: string }>();
</script>

<template>
    <div
        class="flex min-h-[54px] flex-none items-center gap-2.5 border-b border-border px-4 text-body max-[760px]:flex-wrap max-[760px]:py-2"
        aria-label="Agent"
    >
        <template v-if="agentName">
            <span class="size-2 flex-none rounded-full bg-brand"></span>
            <span class="font-semibold text-text">{{ agentName }}</span>
            <span class="text-text-3">Working</span>
        </template>
        <template v-else>
            <span class="size-2 flex-none rounded-full bg-text-4"></span>
            <span class="font-semibold text-text-4">Idle</span>
            <span class="text-text-4">No session</span>
        </template>
    </div>
</template>
