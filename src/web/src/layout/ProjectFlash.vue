<script setup>
import {onUnmounted, ref, watch} from "vue";
import {ink, project, tint} from "../identity.js";
import {away, flash} from "../platform/visibility.js";
import {route} from "../route.js";

const SHOWN_FOR = 2000;
const showing = ref(false);
let timer = 0;

watch(
    [() => flash.at, () => away.hidden],
    () => {
        showing.value = true;
        if (document.visibilityState !== "visible") {
            clearTimeout(timer);
            timer = 0;
            return;
        }
        clearTimeout(timer);
        timer = setTimeout(() => ((showing.value = false), (timer = 0)), SHOWN_FOR);
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
    <Transition name="veil">
        <div v-if="showing" :class="['flash-veil', {fading: !away.hidden}]" aria-hidden="true" />
    </Transition>
    <Transition name="flash">
        <div v-if="showing" :class="['project-flash', {fading: !away.hidden}]" :style="{'--tint': tint}" aria-hidden="true">
            <span class="badge" :style="{background: tint, color: ink}">{{ project.charAt(0).toUpperCase() }}</span>
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

.flash-veil.fading {
    animation: veil-go 1050ms ease forwards;
}

@keyframes veil-go {
    0%,
    85% {
        opacity: 1;
        backdrop-filter: blur(6px);
        -webkit-backdrop-filter: blur(6px);
    }

    100% {
        opacity: 0;
        backdrop-filter: blur(0);
        -webkit-backdrop-filter: blur(0);
    }
}

.flash-veil {
    position: fixed;
    inset: 0;
    z-index: 89;
    background: rgba(0, 0, 0, 0.18);
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
    pointer-events: none;
}

.veil-enter-active {
    transition: none;
}

.veil-leave-active {
    transition: opacity 240ms ease;
}

.veil-enter-from,
.veil-leave-to {
    opacity: 0;
}

.project-flash.fading {
    animation: hold-then-go 1050ms ease forwards;
}

@keyframes hold-then-go {
    0%,
    85% {
        opacity: 1;
    }

    100% {
        opacity: 0;
    }
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
    transition: none;
}

.flash-leave-active {
    transition:
        opacity 150ms ease,
        transform 150ms ease;
}

.flash-leave-to {
    opacity: 0;
    transform: translate(-50%, -4px);
}
</style>
