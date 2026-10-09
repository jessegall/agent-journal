<script setup>
import CloseButton from "./CloseButton.vue";
import {onUnmounted, ref, useId, watch} from "vue";
import {closing} from "../composables/closing.js";
import {stacking} from "../composables/stacking.js";
import {useTrap} from "../composables/trap.js";

const ARMED_AFTER_MS = 500;
const NUDGE_MS = 400;

const props = defineProps({
    title: {type: String, default: ""},
    follow: {type: Boolean, default: false},
    fits: Boolean,
    small: Boolean,
    tall: Boolean,
    large: Boolean,
    bare: Boolean,
    open: {type: Boolean, default: null},
    closable: {type: Boolean, default: true},
    modal: Boolean,
    sheet: Boolean,
});
const emit = defineEmits(["close", "dismiss", "escape"]);
const {visible, close, closed} = closing(emit, props);
const layer = stacking(visible);
const body = ref(null);
const panel = ref(null);
const heading = ref(null);
const headingId = useId();
const nudged = ref(false);
const openedAt = Date.now();

if (props.modal) useTrap(panel, () => emit("escape"), heading);

function outside() {
    if (!props.modal) return props.closable && close();
    nudged.value = true;
    setTimeout(() => (nudged.value = false), NUDGE_MS);
}

function unarmed(event) {
    if (!props.modal || Date.now() - openedAt >= ARMED_AFTER_MS || ![" ", "Enter"].includes(event.key)) return;
    event.preventDefault();
    event.stopPropagation();
}
const toBottom = () => body.value && (body.value.scrollTop = body.value.scrollHeight);
const watcher = new MutationObserver(toBottom);

watch(body, (el) => {
    watcher.disconnect();
    if (el && props.follow) {
        watcher.observe(el, {childList: true, subtree: true, characterData: true});
        toBottom();
    }
});
onUnmounted(() => watcher.disconnect());
</script>

<template>
    <Transition name="dialog" appear @after-leave="closed">
        <div v-if="visible" :class="['dialog', {large, sheet}]" :style="{zIndex: layer}" @click.self="outside">
            <section
                ref="panel"
                :class="['dialog-panel', {fixed: !fits, small, tall, large, sheet, nudged}]"
                role="dialog"
                :aria-modal="modal || undefined"
                :aria-label="modal ? undefined : title"
                :aria-labelledby="modal ? headingId : undefined"
                @keydown.capture="unarmed"
            >
                <template v-if="!bare">
                    <header class="dialog-head">
                        <h3 :id="headingId" ref="heading" :tabindex="modal ? -1 : undefined">{{ title }}</h3>
                        <template v-if="closable">
                            <CloseButton @click="close" />
                        </template>
                    </header>
                </template>
                <div ref="body" :class="['dialog-body', {bare}]">
                    <slot />
                </div>
                <template v-if="$slots.foot">
                    <footer class="dialog-foot">
                        <slot name="foot" />
                    </footer>
                </template>
            </section>
        </div>
    </Transition>
</template>

<style scoped>
.dialog {
    position: fixed;
    inset: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background: rgba(0, 0, 0, 0.62);
}

.dialog-panel.nudged {
    animation: nudge 0.28s ease;
}

@keyframes nudge {
    40% {
        transform: scale(1.015);
    }
}

@media (prefers-reduced-motion: reduce) {
    .dialog-panel.nudged {
        animation: none;
        outline: 2px solid var(--accent);
    }
}

.dialog-panel {
    display: flex;
    flex-direction: column;
    width: min(720px, 100%);
    max-height: min(640px, 100%);
    border: 1px solid var(--border-2);
    border-radius: 12px;
    background: var(--raised);
    overflow: hidden;
}

.dialog-panel.fixed {
    height: min(640px, 100%);
}

.dialog-panel.small {
    width: min(440px, 100%);
}

.dialog.large {
    padding: 22px 28px;
}

.dialog-panel.large {
    width: 100%;
    max-height: 100%;
}

.dialog-panel.fixed.large {
    height: 100%;
}

.dialog-body.bare {
    display: flex;
    flex: 1;
    flex-direction: column;
    padding: 0;
    overflow: hidden;
}

@media (max-width: 600px) {
    .dialog.large {
        padding: 0;
    }

    .dialog-panel.large {
        border: 0;
        border-radius: 0;
    }
}

@media (max-width: 600px) {
    .dialog.sheet {
        align-items: flex-end;
        padding: 12px;
    }

    .dialog-panel.sheet {
        width: 100%;
        border-radius: 16px;
    }
}

.dialog-panel.fixed.small {
    height: min(320px, 100%);
}

.dialog-panel.fixed.small.tall {
    height: min(500px, 100%);
}

.dialog-panel.fixed .dialog-body {
    display: flex;
    flex: 1;
    flex-direction: column;
}

.dialog-enter-active,
.dialog-leave-active,
.dialog-enter-active .dialog-panel,
.dialog-leave-active .dialog-panel {
    transition:
        opacity 0.18s ease,
        transform 0.18s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.dialog-enter-from,
.dialog-leave-to {
    opacity: 0;
}

.dialog-enter-from .dialog-panel,
.dialog-leave-to .dialog-panel {
    transform: translateY(8px) scale(0.98);
}

.dialog-head {
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 12px 14px;
    border-bottom: 1px solid var(--border);
}

.dialog-head h3 {
    flex: 1;
    margin: 0;
    font-size: 13.5px;
    font-weight: 600;
    outline: none;
}

.dialog-body {
    min-height: 0;
    overflow: auto;
    padding: 14px;
}

.dialog-foot {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    border-top: 1px solid var(--border);
}
</style>
