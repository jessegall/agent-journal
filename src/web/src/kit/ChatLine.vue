<script setup>
defineProps({mine: Boolean, quiet: Boolean});
</script>

<template>
    <template v-if="mine">
        <p class="chat-line mine"><slot /></p>
    </template>
    <template v-else>
        <p :class="['chat-line', {quiet}]">
            <span class="badge">A</span>
            <span><slot /></span>
        </p>
    </template>
</template>

<style scoped>
.chat-line {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin: 0;
    font-size: 13px;
    line-height: 1.5;
}

.chat-line.quiet {
    color: var(--text-3);
}

.chat-line.mine {
    align-self: flex-end;
    max-width: 86%;
    padding: 7px 11px;
    border-radius: 10px;
    background: var(--sel);
}

.badge {
    display: grid;
    flex: none;
    place-items: center;
    width: 18px;
    height: 18px;
    margin-top: 1px;
    border: 1px solid var(--border-2);
    border-radius: 5px;
    background: var(--sel);
    color: var(--text-2);
    font-size: 10px;
    font-weight: 600;
}
</style>
