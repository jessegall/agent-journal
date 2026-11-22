<script setup lang="ts">
import { nextTick, onMounted, onUpdated, provide, useTemplateRef, watch } from 'vue';
import { listBoxActiveKey } from './listBoxActive';

/**
 * A list with one active option, driven from a field that keeps the focus: the default slot holds MenuItems in option
 * mode (each with an id) and MenuGroups. The field passes its keydown to controlKeys: Down, Up, Home and End move the
 * active option and wrap, Enter chooses it, and with no option they do nothing. The field names the list in
 * aria-controls and the active option in aria-activedescendant, which is the activeId model. The first option is active
 * until another is chosen, and the active row scrolls into view. It is 340px high at most as a popover and 420px as a
 * palette, with padding 6.
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
