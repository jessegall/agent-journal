<script setup lang="ts">
/**
 * Version 5's agent bar (shell/AgentBar.vue) under decision D3: 54 px holding the sections the domains put in Home's
 * bar, such as the chosen agent with its state and actions, and the account notices.
 */
</script>

<template>
    <div
        class="flex min-h-[54px] flex-none items-center gap-2.5 border-b border-border px-4 text-body max-[760px]:flex-wrap max-[760px]:py-2"
        aria-label="Agent"
    >
        <slot />
    </div>
</template>
