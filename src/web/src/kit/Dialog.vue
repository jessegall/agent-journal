<script setup>
import CloseButton from "./CloseButton.vue";
import {onUnmounted, ref, watch} from "vue";
import {closing} from "./closing.js";

const props = defineProps({
    title: {type: String, default: ""},
    follow: {type: Boolean, default: false},
    fixed: {type: Boolean, default: false},
    small: Boolean,
});
const emit = defineEmits(["close", "dismiss"]);
const {shown, close, closed} = closing(emit);
const body = ref(null);
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
        <div v-if="shown" class="dialog" @click.self="close">
            <section :class="['dialog-panel', {fixed, small}]">
                <header class="dialog-head">
                    <h3>{{ title }}</h3>
                    <CloseButton @click="close" />
                </header>
                <div ref="body" class="dialog-body">
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
    z-index: 80;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 32px;
    background: rgba(0, 0, 0, 0.62);
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

.dialog-panel.fixed.small {
    height: min(320px, 100%);
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
