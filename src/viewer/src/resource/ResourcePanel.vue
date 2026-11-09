<script setup>
import {computed, nextTick, onUnmounted, ref, watch} from "vue";
import {opening, peek, route, unpeek} from "../route.js";
import InspectorPanel from "./InspectorPanel.vue";
import {cliOf} from "../domain/resourceNouns.js";

// the inspector: the row the address opens, over the page, as version 4's side panel drew it; each opened row stacks on the one before
const props = defineProps({read: {type: Function, required: true}, catalogue: {type: Object, required: true}, environment: {type: String, required: true}, readOnly: Boolean});

const opened = computed(() => route.value.open);
const term = computed(() => (opened.value ? cliOf(opened.value.table) : ""));
const fullyOpen = ref(false);

const close = () => opening([]);
// focus moves into the panel when it opens and back to what opened it when it closes; Escape closes an open action form first, then the top row
const panel = ref(null);
let opener = null;
watch(() => Boolean(opened.value), async (now) => {
    if (now) {
        opener = document.activeElement;
        await nextTick();
        panel.value?.focus();
        return;
    }
    opener?.focus?.();
    opener = null;
}, {immediate: true});
const closeOnEscape = (event) => event.key === "Escape" && opened.value && !document.querySelector('[role="dialog"][aria-modal="true"]') && unpeek();
window.addEventListener("keydown", closeOnEscape);
onUnmounted(() => window.removeEventListener("keydown", closeOnEscape));
</script>

<template>
    <Teleport to="body">
        <Transition name="side" appear @before-enter="fullyOpen = false" @after-enter="fullyOpen = true">
            <div v-if="opened" :class="['veil', {fades: term === 'test-queue'}]" @click.self="close">
                <InspectorPanel
                    ref="panel"
                    :term="noun"
                    :id="opened.id"
                    :table="opened.table"
                    :read="read"
                    :catalogue="catalogue"
                    :environment="environment"
                    :read-only="readOnly"
                    :backed="route.stack.length > 1"
                    :opening="!fullyOpen"
                    @close="close"
                    @back="unpeek"
                    @open="(row) => peek(row.table, row.id)"
                />
            </div>
        </Transition>
    </Teleport>
</template>

<style scoped>
.veil {
    position: fixed;
    z-index: 40;
    inset: 0;
    background: rgba(0, 0, 0, 0.4);
    backdrop-filter: blur(3px);
}

.veil.fades { background: rgba(0, 0, 0, .45); }
.veil.fades .panel { box-shadow: -20px 0 50px rgba(0, 0, 0, .4); }
@media (prefers-color-scheme: light) {
    .veil.fades { background: rgba(20, 22, 30, .32); }
    .veil.fades .panel { box-shadow: -20px 0 50px rgba(20, 22, 30, .16); }
}
.side-enter-active.fades { transition: opacity 220ms ease; }
.side-leave-active.fades { transition: opacity 160ms ease; }
.side-enter-from.fades, .side-leave-to.fades { opacity: 0; }
.side-enter-active.fades .panel, .side-leave-active.fades .panel { transition: none; }
.side-enter-from.fades .panel, .side-leave-to.fades .panel { transform: none; }
@media (prefers-reduced-motion: reduce) { .side-enter-active.fades, .side-leave-active.fades { transition-duration: 100ms; } }

.side-enter-active,
.side-leave-active {
    transition:
        background 0.24s ease,
        backdrop-filter 0.24s ease;
}

.side-enter-active .panel,
.side-leave-active .panel {
    transition: transform 0.28s cubic-bezier(0.2, 0.8, 0.2, 1);
}

.side-enter-from,
.side-leave-to {
    background: transparent;
    backdrop-filter: blur(0);
}

.side-enter-from .panel,
.side-leave-to .panel {
    transform: translateX(100%);
}
</style>
