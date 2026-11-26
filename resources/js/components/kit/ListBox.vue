<script setup lang="ts">
import { nextTick, onMounted, onUpdated, provide, useTemplateRef, watch } from 'vue';
import { listBoxActiveKey } from './listBoxActive';

/**
 * A list with one active option, driven from a field that keeps the focus: the field passes its keydown to controlKeys,
 * where Down, Up, Home and End move and wrap and Enter chooses, and names the list and the active option (the activeId
 * model) in its aria attributes. Measures: docs/designs/kit-components.md.
 */
withDefaults(defineProps<{ label: string; size?: 'popover' | 'palette' }>(), { size: 'popover' });

const activeId = defineModel<string | null>('activeId', { default: null });
const list = useTemplateRef<HTMLElement>('list');

provide(listBoxActiveKey, activeId);

function options(): HTMLElement[] {
    if (list.value === null) {
        return [];
    }

    return Array.from(list.value.querySelectorAll<HTMLElement>('[role="option"]:not(:disabled):not([aria-disabled="true"])'));
}

function controlKeys(event: KeyboardEvent): void {
    const shown = options();

    if (shown.length === 0) {
        return;
    }

    const current = shown.findIndex((option) => option.id === activeId.value);

    if (event.key === 'Enter') {
        event.preventDefault();
        shown[current]?.click();

        return;
    }

    const targets: Record<string, number> = {
        ArrowDown: current + 1,
        ArrowUp: current < 0 ? shown.length - 1 : current - 1,
        Home: 0,
        End: shown.length - 1,
    };

    if (!(event.key in targets)) {
        return;
    }

    event.preventDefault();
    activeId.value = shown[(targets[event.key] + shown.length) % shown.length].id;
}

function keepAnActiveOption(): void {
    const shown = options();

    if (shown.some((option) => option.id === activeId.value)) {
        return;
    }

    activeId.value = shown[0]?.id ?? null;
}

onMounted(keepAnActiveOption);
onUpdated(keepAnActiveOption);

watch(activeId, async (id) => {
    await nextTick();

    options()
        .find((option) => option.id === id)
        ?.scrollIntoView({ block: 'nearest' });
});

defineExpose({ controlKeys });
</script>

<template>
    <div
        ref="list"
        role="listbox"
        :aria-label="label"
        class="overflow-y-auto p-1.5"
        :class="size === 'palette' ? 'max-h-105' : 'max-h-85'"
    >
        <slot />
    </div>
</template>
