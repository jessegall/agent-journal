<script setup>
defineProps({answer: {type: String, required: true}, left: {type: Number, required: true}, seconds: {type: Number, required: true}});
const emit = defineEmits(["now", "undo"]);
</script>

<template>
    <div class="sending">
        <button type="button" class="sending-now" :aria-label="`Send “${answer}” now`" @click="emit('now')">
            <span class="sending-words">Sending “{{ answer }}”</span>
            <span class="sending-left" aria-hidden="true">{{ left }}s</span>
        </button>
        <button type="button" class="sending-undo" :aria-label="`Cancel sending “${answer}”, it sends in ${seconds} seconds`" @click="emit('undo')">Cancel</button>
    </div>
</template>

<style scoped>
.sending {
    display: flex;
    gap: 8px;
    min-height: 44px;
}

.sending-now {
    display: flex;
    flex: 1;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    min-width: 0;
    padding: 0 16px;
    border: 0;
    border-radius: 12px;
    background: var(--accent);
    color: #fff;
    font: inherit;
    font-weight: 600;
    text-align: left;
}

.sending-words {
    min-width: 0;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
}

.sending-left {
    flex: none;
    font-variant-numeric: tabular-nums;
    opacity: 0.85;
}

.sending-undo {
    flex: none;
    min-width: 88px;
    padding: 0 16px;
    border: 0;
    border-radius: 12px;
    background: color-mix(in oklab, var(--accent) 14%, transparent);
    color: var(--accent-text);
    font: inherit;
    font-weight: 600;
}
</style>
