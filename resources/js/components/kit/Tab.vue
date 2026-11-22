<script setup lang="ts">
import { inject } from 'vue';
import type { IconName } from './Icon.vue';
import Icon from './Icon.vue';
import IconButton from './IconButton.vue';
import { tabsKey } from './tabs';

/**
 * One tab of a Tabs list: --text-badge with .03em spacing, --text-3, padding 7 0 and a least width of 56 px; a long
 * label shrinks and ends in an ellipsis. The chosen tab is --text with an inset 1px bottom line (--brand for a page or
 * an active pane, --border-3 otherwise). Only the chosen tab is a tab stop. A closable tab shows a close button on
 * hover, selection or focus, and closes on Delete, Backspace or a middle click.
 */
const props = defineProps<{ value: string; label: string; icon?: IconName; count?: number; closable?: boolean }>();
const group = inject(tabsKey);

function press(event: KeyboardEvent): void {
    if (props.closable && (event.key === 'Delete' || event.key === 'Backspace')) {
        event.preventDefault();
        group?.close(props.value);
    }

    if (event.key === 'Enter' || event.key === ' ') {
        event.preventDefault();
        group?.select(props.value);
    }
}

function middleClick(event: MouseEvent): void {
    if (props.closable && event.button === 1) {
        group?.close(props.value);
    }
}
</script>

<template>
    <div
        :id="group?.tabId(value)"
        role="tab"
        :aria-selected="group?.active.value === value"
        :aria-controls="group?.panelId(value)"
        :tabindex="group?.active.value === value ? 0 : -1"
        class="group/tab inline-flex min-w-14 shrink items-center gap-1.5 py-[7px] text-badge tracking-[0.03em] transition-colors duration-(--duration-hover) focus-visible:outline-2 focus-visible:-outline-offset-1 focus-visible:outline-focus"
        :class="
            group?.active.value === value
                ? [
                      'text-text',
                      group.line.value === 'brand'
                          ? 'shadow-[inset_0_-1px_0_var(--brand)]'
                          : 'shadow-[inset_0_-1px_0_var(--border-3)]',
                  ]
                : 'text-text-3 hover:text-text-2'
        "
        @click="group?.select(value)"
        @auxclick="middleClick"
        @keydown="press"
    >
        <template v-if="icon">
            <Icon :name="icon" size="sm" />
        </template>
        <span class="min-w-0 truncate">{{ label }}</span>
        <template v-if="count !== undefined">
            <span class="tabular-nums">{{ count }}</span>
        </template>
        <template v-if="closable">
            <span
                class="opacity-0 group-focus-within/tab:opacity-100 group-hover/tab:opacity-100 group-aria-selected/tab:opacity-100"
                @click.stop
            >
                <IconButton icon="close" :label="`Close ${label}`" size="xs" tabindex="-1" @click="group?.close(value)" />
            </span>
        </template>
    </div>
</template>
