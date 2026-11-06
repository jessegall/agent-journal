<script setup>
import {computed, inject, ref, useAttrs} from "vue";
import {WINDOW_CONTEXT} from "../../kit/windowContextKey.js";
import {SPINNER_AFTER_MS} from "../platform/pressed.js";
import Icon from "./Icon.vue";
import Spinner from "./Spinner.vue";

defineOptions({inheritAttrs: false});
const props = defineProps({
    variant: {type: String, default: "ghost"},
    small: Boolean,
    large: Boolean,
    busy: Boolean,
    disabled: Boolean,
    fill: Boolean,
    bordered: Boolean,
    href: {type: String, default: ""},
    icon: {type: String, default: ""},
});
// a click whose handler waits on something, such as a request, shows the spinner until it is done; one that answers at once never shows it
const attrs = useAttrs();
const passedOn = computed(() => Object.fromEntries(Object.entries(attrs).filter(([name]) => name !== "onClick")));
const waiting = ref(false);
const shownBusy = computed(() => props.busy || waiting.value);
const windowContext = inject(WINDOW_CONTEXT, null);
// a window a share link shows is only looked at, so its buttons do nothing
const idle = computed(() => shownBusy.value || props.disabled || Boolean(windowContext?.readOnly));

async function clicked(event) {
    const answers = [attrs.onClick].flat().filter(Boolean).map((handler) => handler(event)).filter((answer) => answer instanceof Promise);
    if (!answers.length) return;
    const timer = setTimeout(() => (waiting.value = true), SPINNER_AFTER_MS);
    try {
        await Promise.all(answers);
    } finally {
        clearTimeout(timer);
        waiting.value = false;
    }
}
</script>

<template>
    <component
        :is="href ? 'a' : 'button'"
        v-bind="passedOn"
        :type="href ? undefined : attrs.type || 'button'"
        :href="href || undefined"
        :class="['btn', variant, {small, large, busy: shownBusy, fill, bordered}]"
        :aria-busy="shownBusy"
        :disabled="idle"
        @click="clicked"
    >
        <span :class="['btn-label', {hidden: shownBusy}]">
            <template v-if="icon">
                <Icon :name="icon" :size="12" />
            </template>
            <slot />
        </span>
        <template v-if="shownBusy">
            <Spinner class="btn-spinner" />
        </template>
    </component>
</template>

<style scoped>
.btn {
    position: relative;
    display: inline-flex;
    align-items: center;
    gap: 6px;
    height: 28px;
    padding: 0 11px;
    border: 1px solid transparent;
    border-radius: 7px;
    background: transparent;
    color: var(--text-2);
    font-size: 12.5px;
    text-decoration: none;
    cursor: pointer;
    white-space: nowrap;
}

.btn-label {
    display: inline-flex;
    align-items: center;
    gap: 6px;
}

.btn-label.hidden {
    visibility: hidden;
}

.btn.fill .btn-label {
    flex: 1;
    min-width: 0;
}

.btn-spinner {
    position: absolute;
    inset: 0;
    margin: auto;
}

.btn :deep(.ico) {
    width: 12px;
    height: 12px;
}
.btn:hover {
    background: var(--hover);
    color: var(--text);
}
.btn:focus-visible {
    outline: 2px solid var(--accent);
    outline-offset: 2px;
}
.btn.bordered {
    border-color: var(--border-2);
}

.btn.primary {
    border-color: var(--accent);
    background: var(--accent-dim);
    color: var(--accent-text);
}
.btn.primary:hover {
    background: var(--accent);
    color: #fff;
}
.btn.danger {
    border-color: color-mix(in oklab, var(--danger) 55%, var(--border-2));
    color: var(--danger);
}

.btn.danger:hover {
    border-color: var(--danger);
    background: color-mix(in oklab, var(--danger) 12%, transparent);
    color: var(--danger);
}
.btn.text {
    height: auto;
    padding: 0;
    border: 0;
    border-radius: 0;
    background: none;
    font: inherit;
    text-align: left;
    white-space: normal;
}

.btn.text:hover {
    background: none;
    color: var(--text);
}

.btn.text .btn-label {
    display: block;
}

/* an icon button is a small square that never grows with the bar or header it sits in */
.btn.icon {
    flex: none;
    align-self: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    padding: 0;
    border-color: transparent;
}
.btn.icon:hover {
    background: color-mix(in srgb, var(--border-3) 70%, transparent);
    color: var(--text);
}
.btn.small {
    height: 24px;
    padding: 0 9px;
    font-size: 12px;
}

.btn.large {
    height: 36px;
    padding: 0 14px;
    font-size: 13.5px;
}

.btn:disabled:not(.busy):not([data-busy]) {
    opacity: 0.45;
    cursor: default;
    pointer-events: none;
}
</style>
