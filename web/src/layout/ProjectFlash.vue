<script setup>
import {onUnmounted, ref, watch} from "vue";
import {negative, project, tint} from "../identity.js";
import {flash} from "../platform/visibility.js";
import {route} from "../route.js";

const SHOWN_FOR = 3100;
const showing = ref(false);
let timer = 0;

watch(
    () => flash.at,
    () => {
        showing.value = true;
        clearTimeout(timer);
        timer = setTimeout(() => (showing.value = false), SHOWN_FOR);
    },
    {immediate: true}
);
watch(
    () => route.value.env,
    (now, before) => {
        if (before && now !== before) flash.at = Date.now();
    }
);
onUnmounted(() => clearTimeout(timer));
</script>

<template>
    <Transition name="flash">
        <div v-if="showing" class="project-flash" :style="{'--tint': tint}" aria-hidden="true">
            <span class="badge" :style="{background: tint, color: negative}">{{ project.charAt(0).toUpperCase() }}</span>
            <span class="name">{{ project }} · {{ route.env }}</span>
        </div>
    </Transition>
</template>

<style scoped>
.project-flash {
    position: fixed;
    top: 72px;
    left: 50%;
    z-index: 90;
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 22px 12px 14px;
    border: 1px solid color-mix(in srgb, var(--tint) 55%, var(--border));
    border-radius: 14px;
    background: color-mix(in srgb, var(--raised) 88%, var(--tint));
    box-shadow:
        0 12px 40px rgba(0, 0, 0, 0.45),
        0 0 0 6px color-mix(in srgb, var(--tint) 12%, transparent);
    transform: translateX(-50%);
    pointer-events: none;
}

.badge {
    display: grid;
    place-items: center;
    width: 32px;
    height: 32px;
    border-radius: 8px;
    font-size: 17px;
    font-weight: 700;
}

.name {
    font-size: 20px;
    font-weight: 600;
    letter-spacing: -0.01em;
    color: var(--text);
}

.flash-enter-active {
    transition:
        opacity 180ms ease,
        transform 240ms cubic-bezier(0.22, 0.7, 0.3, 1);
}

.flash-leave-active {
    transition:
        opacity 320ms ease,
        transform 320ms ease;
}

.flash-enter-from {
    opacity: 0;
    transform: translate(-50%, -8px) scale(0.97);
}

.flash-leave-to {
    opacity: 0;
    transform: translate(-50%, -4px);
}
</style>
