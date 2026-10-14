<script setup>
import {ref} from "vue";
import Btn from "./Btn.vue";
import Dialog from "./Dialog.vue";

defineProps({
    eyebrow: {type: String, required: true},
    title: {type: String, required: true},
    text: {type: String, required: true},
    button: {type: String, required: true},
    note: {type: String, default: ""},
    art: {type: String, default: ""},
    off: {type: String, default: ""},
    busy: Boolean,
});
const emit = defineEmits(["use", "dismiss", "off"]);
const artMissing = ref(false);
</script>

<template>
    <Dialog bare fits small sheet modal :title="title" @dismiss="emit('dismiss')">
        <div class="new-feature">
            <div class="new-feature-glow" />
            <template v-if="art && !artMissing">
                <img class="new-feature-art" :src="art" alt="" @error="artMissing = true" />
            </template>
            <template v-else>
                <div class="new-feature-badge">
                    <svg viewBox="0 0 34 34" fill="none" stroke="#c9ccf8" stroke-width="1.7" stroke-linejoin="round" stroke-linecap="round">
                        <path d="M17 3 L28 7 V16 C28 23 23 28 17 31 C11 28 6 23 6 16 V7 Z" />
                        <path
                            d="M17 10 L18.8 15.2 L24 17 L18.8 18.8 L17 24 L15.2 18.8 L10 17 L15.2 15.2 Z"
                            fill="#a3a8f0"
                            fill-opacity=".28"
                        />
                    </svg>
                </div>
            </template>
            <div class="new-feature-eyebrow">{{ eyebrow }}</div>
            <h2 class="new-feature-title">{{ title }}</h2>
            <p class="new-feature-text">{{ text }}</p>
            <div class="new-feature-actions">
                <Btn kind="primary" fill :busy="busy" @click="emit('use')">{{ button }}</Btn>
                <template v-if="off">
                    <Btn fill :disabled="busy" @click="emit('off')">{{ off }}</Btn>
                </template>
                <template v-else>
                    <Btn fill :disabled="busy" @click="emit('dismiss')">Not now</Btn>
                </template>
            </div>
            <template v-if="note">
                <p class="new-feature-note">{{ note }}</p>
            </template>
        </div>
    </Dialog>
</template>

<style scoped>
.new-feature {
    position: relative;
    isolation: isolate;
    overflow: hidden;
    padding: 32px 28px 22px;
    text-align: center;
}

.new-feature-glow {
    position: absolute;
    top: -70px;
    left: 50%;
    z-index: -1;
    width: 340px;
    height: 260px;
    transform: translateX(-50%);
    background: radial-gradient(closest-side, color-mix(in oklab, var(--accent) 34%, transparent), transparent);
    filter: blur(14px);
    opacity: 0.75;
    pointer-events: none;
    animation: breathe 5s ease-in-out infinite;
}

@keyframes breathe {
    50% {
        opacity: 0.5;
    }
}

@media (prefers-reduced-motion: reduce) {
    .new-feature-glow {
        animation: none;
    }
}

.new-feature-badge {
    display: grid;
    place-items: center;
    width: 64px;
    height: 64px;
    margin: 0 auto 18px;
    border: 1px solid var(--border-3);
    border-radius: 18px;
    background: linear-gradient(160deg, var(--sel), var(--bg));
    box-shadow:
        0 0 0 1px rgba(255, 255, 255, 0.03) inset,
        0 0 26px color-mix(in oklab, var(--accent) 30%, transparent);
}

.new-feature-badge svg {
    width: 34px;
    height: 34px;
}

.new-feature-art {
    display: block;
    width: 100%;
    max-height: 180px;
    margin: 0 0 18px;
    border-radius: 10px;
    object-fit: cover;
}

.new-feature-eyebrow {
    margin: 0 0 8px;
    color: var(--accent-text);
    font: 11px var(--mono);
    letter-spacing: 0.07em;
    text-transform: uppercase;
}

.new-feature-title {
    margin: 0 0 12px;
    font-size: 19px;
    font-weight: 600;
    letter-spacing: -0.01em;
}

.new-feature-text {
    margin: 0 0 24px;
    color: var(--text-2);
    font-size: 13.5px;
    line-height: 1.6;
    text-wrap: pretty;
}

.new-feature-actions {
    display: flex;
    flex-direction: column;
    gap: 6px;
}

.new-feature-actions :deep(.btn) {
    justify-content: center;
    text-align: center;
}

.new-feature-actions :deep(.btn:not(.primary)) {
    border-color: transparent;
    background: none;
    color: var(--text-3);
}

.new-feature-actions :deep(.btn:not(.primary):hover) {
    background: var(--hover);
    color: var(--text);
}

.new-feature-note {
    margin: 14px 0 0;
    color: var(--text-3);
    font-size: 12px;
}

@media (max-width: 600px) {
    .new-feature {
        padding: 32px 22px 18px;
    }

    .new-feature-actions :deep(.btn) {
        height: 44px;
    }
}
</style>
