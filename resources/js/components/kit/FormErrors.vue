<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

/**
 * Every error of a form in one alert, focused when errors arrive so a keyboard or screen reader lands on them.
 */
const props = defineProps<{ errors: Partial<Record<string, string>> }>();

const box = ref<HTMLElement | null>(null);
const messages = ref<string[]>([]);

watch(
    () => props.errors,
    async (errors) => {
        messages.value = Object.values(errors).filter(
            (message) => typeof message === 'string',
        );

        if (messages.value.length === 0) {
            return;
        }

        await nextTick();
        box.value?.focus();
    },
    { immediate: true, deep: true },
);
</script>

<template>
    <div
        v-show="messages.length > 0"
        ref="box"
        role="alert"
        tabindex="-1"
        class="rounded-control border border-[color-mix(in_srgb,var(--danger)_48%,var(--border-2))] bg-[color-mix(in_srgb,var(--danger)_9%,transparent)] px-3 py-2 text-small text-danger outline-none"
    >
        <ul class="flex flex-col gap-1">
            <template v-for="message in messages" :key="message">
                <li>{{ message }}</li>
            </template>
        </ul>
    </div>
</template>
