<script setup lang="ts">
import { computed, inject } from 'vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';
import { treeKey } from './tree';

/**
 * One row of a Tree, 24 high, in --text-field --text-2: a chevron 12 (or a spacer for a leaf), an Icon 14 and the
 * label with an ellipsis, indented 8 plus 14 per level. Hover --hover; selected --sel and --text; the ring at offset
 * -2. It is a treeitem with aria-level, aria-selected and, for a folder, aria-expanded; only one item of the Tree is in
 * the tab order. Up and Down walk, Right opens a folder and then enters it, Left closes it and then goes to the parent,
 * Enter opens the item. The chevron turns 90 degrees over 120 ms, and not at all under reduced motion.
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
