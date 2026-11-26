<script setup lang="ts">
import { computed, inject } from 'vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';
import { treeKey } from './tree';

/**
 * One row of a Tree: a chevron or a spacer, an icon and the label, indented per level, as a treeitem of which only one
 * is a tab stop. Up and Down walk, Right opens and enters a folder, Left closes it and goes to the parent, Enter opens.
 * Measures: docs/designs/kit-components.md.
 */
const props = defineProps<{
    value: string;
    label: string;
    level: number;
    icon: IconName;
    folder?: boolean;
    selected?: boolean;
}>();

const emit = defineEmits<{ open: [] }>();
const expanded = defineModel<boolean>('expanded', { default: false });

const tree = inject(treeKey);
const indent = computed(() => `calc(var(--spacing) * ${2 + 3.5 * (props.level - 1)})`);

function onKey(event: KeyboardEvent): void {
    const row = event.currentTarget as HTMLElement;
    const handled = keyAction(event.key, row);

    if (handled) {
        event.preventDefault();
    }
}

function keyAction(key: string, row: HTMLElement): boolean {
    if (key === 'Enter') {
        emit('open');

        return true;
    }

    if (key === 'ArrowRight' && props.folder && !expanded.value) {
        expanded.value = true;

        return true;
    }

    if (key === 'ArrowLeft' && props.folder && expanded.value) {
        expanded.value = false;

        return true;
    }

    const moves: Record<string, Parameters<NonNullable<typeof tree>['move']>[1]> = {
        ArrowDown: 'next',
        ArrowUp: 'previous',
        Home: 'first',
        End: 'last',
        ArrowRight: 'child',
        ArrowLeft: 'parent',
    };

    if (!(key in moves)) {
        return false;
    }

    tree?.move(row, moves[key]);

    return true;
}
</script>

<template>
    <div
        role="treeitem"
        :data-key="value"
        :aria-level="level"
        :aria-selected="selected === true"
        :aria-expanded="folder ? expanded : undefined"
        :tabindex="tree?.active.value === value ? 0 : -1"
        class="flex h-6 cursor-pointer items-center gap-1.5 pr-2 text-field transition-colors duration-(--duration-hover) hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus motion-reduce:transition-none"
        :class="selected ? 'bg-sel text-text' : 'text-text-2'"
        :style="{ paddingInlineStart: indent }"
        @focus="tree && (tree.active.value = value)"
        @keydown="onKey"
        @click="emit('open')"
    >
        <span
            v-if="folder"
            aria-hidden="true"
            class="inline-flex size-3 shrink-0 transition-transform duration-(--duration-hover) motion-reduce:transition-none"
            :class="{ 'rotate-90': expanded }"
            @click.stop="expanded = !expanded"
        >
            <Icon name="chevron" :size="12" />
        </span>
        <span v-else aria-hidden="true" class="size-3 shrink-0" />
        <Icon :name="icon" :size="14" class="shrink-0" />
        <span class="min-w-0 truncate">{{ label }}</span>
    </div>
</template>
