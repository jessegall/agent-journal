<script setup>
import {ref} from "vue";

defineProps({label: {type: String, default: ""}, folded: Boolean, lifted: Boolean, kind: {type: String, default: ""}});
const card = ref(null);
defineExpose({card});
</script>

<template>
    <div :class="['chat-dock', {lifted}]">
        <div class="chat-dock-fold">
            <section ref="card" :class="['chat-dock-card', kind]" :aria-label="label">
                <header class="chat-dock-head">
                    <slot name="head" />
                </header>
                <div :class="['chat-dock-body', {folded}]">
                    <div class="chat-dock-inner">
                        <slot />
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<style scoped>
.chat-dock {
    display: grid;
    grid-template-rows: 1fr;
    grid-template-columns: minmax(0, 1fr);
    flex: none;
    width: 100%;
}

.chat-dock-fold {
    min-width: 0;
    min-height: 0;
}

.chat-dock-card {
    container-type: inline-size;
    border: 1px solid var(--border-2);
    border-radius: 10px;
    background: var(--raised);
}

.chat-dock-head {
    display: flex;
    align-items: center;
    gap: 10px;
    min-width: 0;
    height: 36px;
    padding: 0 6px 0 15px;
    white-space: nowrap;
}

.chat-dock-body {
    display: grid;
    grid-template-rows: 1fr;
    transition:
        grid-template-rows var(--move),
        opacity var(--fade);
}

.chat-dock-body.folded {
    grid-template-rows: 0fr;
    opacity: 0;
}

.chat-dock-inner {
    min-height: 0;
    overflow: hidden;
}

.chat-dock.dock-enter-active,
.chat-dock.dock-leave-active {
    transition:
        grid-template-rows 0.32s var(--ease),
        opacity 0.24s ease;
}

.chat-dock.dock-enter-active .chat-dock-fold,
.chat-dock.dock-leave-active .chat-dock-fold {
    overflow: hidden;
}

.chat-dock.dock-enter-from,
.chat-dock.dock-leave-to {
    grid-template-rows: 0fr;
    opacity: 0;
}

.chat-dock.lifted .chat-dock-card {
    visibility: hidden;
}

@container (max-width: 300px) {
    .chat-dock-head :slotted(.chat-dock-acts) {
        display: none;
    }
}

@media (prefers-reduced-motion: reduce) {
    .chat-dock.dock-enter-active,
    .chat-dock.dock-leave-active,
    .chat-dock-body {
        transition: none;
    }
}
</style>
