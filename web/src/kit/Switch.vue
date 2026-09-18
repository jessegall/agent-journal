<script setup>
defineProps({on: Boolean, word: {type: String, default: ""}, title: {type: String, default: ""}});
const emit = defineEmits(["change"]);
</script>

<template>
    <button
        type="button"
        class="switch-button"
        role="switch"
        :aria-checked="on ? 'true' : 'false'"
        :title="title"
        @click="emit('change', !on)"
    >
        <span :class="['switch', {on}]"><span class="knob" /></span>
        <template v-if="word">
            <span class="switch-word">{{ word }}</span>
        </template>
    </button>
</template>

<style scoped>
.switch-button {
    flex: none;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    height: 26px;
    padding: 0 10px 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 13px;
    background: var(--raised);
    color: var(--text-2);
    font-size: 12px;
    cursor: pointer;
}

.switch-button:hover {
    border-color: var(--border-3);
    color: var(--text);
}

.switch {
    position: relative;
    width: 28px;
    height: 16px;
    flex: none;
    border-radius: 8px;
    background: #3a3d44;
}

.knob {
    position: absolute;
    top: 2px;
    left: 2px;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: #cfd2d8;
    transition:
        transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1),
        background 0.15s;
}

.switch.on {
    background: var(--accent);
}

.switch.on .knob {
    transform: translateX(12px);
    background: #fff;
}

.switch-word {
    letter-spacing: 0.01em;
}
</style>
