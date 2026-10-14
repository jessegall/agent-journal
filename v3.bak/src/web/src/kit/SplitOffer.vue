<script setup>
import Btn from "./Btn.vue";
import Icon from "./Icon.vue";

defineProps({text: {type: String, required: true}});
const emit = defineEmits(["pick"]);
</script>

<template>
    <div class="split-offer" @pointerdown.stop>
        <div class="split-offer-card" role="dialog" aria-label="Split this pane in two?">
            <p class="split-offer-title">Split this pane in two?</p>
            <p class="split-offer-text">{{ text }}</p>
            <div class="split-offer-row">
                <Btn kind="primary" @click="emit('pick', 'right')">
                    <Icon name="columns" :size="13" />
                    Side by side
                </Btn>
                <Btn @click="emit('pick', 'bottom')">
                    <Icon name="rows" :size="13" />
                    Stacked
                </Btn>
                <Btn @click="emit('pick', 'center')">
                    <Icon name="tab" :size="13" />
                    Add as tab
                </Btn>
                <Btn class="split-offer-cancel" @click="emit('pick', '')">Cancel</Btn>
            </div>
        </div>
    </div>
</template>

<style scoped>
.split-offer {
    position: absolute;
    inset: 0;
    z-index: 5;
    display: grid;
    place-items: center;
    padding: 16px;
    background: rgba(13, 14, 16, 0.62);
    animation: offer-in 0.16s both;
}

.split-offer-card {
    width: min(410px, 100%);
    padding: 16px;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.45);
    animation: offer-rise 0.2s var(--ease) both;
}

.split-offer-title {
    margin: 0;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--text);
}

.split-offer-text {
    margin: 4px 0 14px;
    font-size: 12px;
    color: var(--text-3);
    text-wrap: pretty;
}

.split-offer-row {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
}

.split-offer-row .split-offer-cancel {
    border-color: transparent;
    color: var(--text-3);
}

@keyframes offer-in {
    from {
        opacity: 0;
    }
}

@keyframes offer-rise {
    from {
        opacity: 0;
        transform: translateY(6px);
    }
}
</style>
