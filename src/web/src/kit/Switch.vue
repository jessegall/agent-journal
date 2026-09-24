<script setup>
defineProps({on: Boolean, word: {type: String, default: ""}, title: {type: String, default: ""}, framed: Boolean, labelled: Boolean});
const emit = defineEmits(["change"]);
</script>

<template>
    <button
        type="button"
        :class="['switch-button', {framed}]"
        role="switch"
        :aria-checked="on ? 'true' : 'false'"
        :title="title"
        @click="emit('change', !on)"
    >
        <span :class="['switch', {on, labelled}]">
            <template v-if="labelled">
                <span class="switch-inner">{{ word }}</span>
            </template>
            <span class="knob" />
        </span>
        <template v-if="word && !labelled">
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
    padding: 0;
    border: 0;
    background: none;
    color: var(--text-2);
    font-size: 12px;
    cursor: pointer;
}

.switch-button.framed {
    padding: 0 10px 0 6px;
    border: 1px solid var(--border-2);
    border-radius: 13px;
    background: var(--raised);
}

.switch-button.framed:hover {
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

.switch.labelled {
    display: inline-flex;
    align-items: center;
    width: auto;
    height: 18px;
    padding: 0 8px 0 20px;
    border-radius: 9px;
    color: var(--text-3);
    font-size: 11px;
    line-height: 18px;
    transition:
        background 0.18s,
        color 0.18s,
        padding 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.switch.labelled .knob {
    top: 3px;
    left: 3px;
    transition:
        left 0.18s cubic-bezier(0.2, 0.8, 0.2, 1),
        background 0.15s;
}

.switch.labelled.on {
    padding: 0 20px 0 8px;
    background: color-mix(in srgb, var(--accent) 55%, white);
    color: #17152a;
    font-weight: 600;
}

.switch.labelled.on .knob {
    left: calc(100% - 15px);
    transform: none;
    background: #17152a;
}

@media (prefers-reduced-motion: reduce) {
    .switch.labelled,
    .switch.labelled .knob {
        transition: none;
    }
}

.switch-word {
    letter-spacing: 0.01em;
}
</style>
