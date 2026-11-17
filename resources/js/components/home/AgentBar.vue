<script setup lang="ts">
/**
 * Version 5's agent bar (shell/AgentBar.vue) under decision D3: 54 px, the 8 px state dot and the state word of the
 * session chosen in the chat. Only running sessions can be chosen, so a chosen one is Working; with none chosen it
 * shows version 5's placeholder.
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
            <span class="font-semibold text-text">Working</span>
        </template>
        <template v-else>
            <span class="size-2 flex-none rounded-full bg-text-4"></span>
            <span class="font-semibold text-text-4">Agent 1</span>
            <span class="text-text-4">No session yet</span>
        </template>
    </div>
</template>
