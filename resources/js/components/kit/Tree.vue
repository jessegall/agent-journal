<script setup lang="ts">
import { onMounted, onUpdated, provide, ref, useTemplateRef } from 'vue';
import { treeKey } from './tree';
import type { TreeMove } from './tree';

/**
 * A role tree of TreeItems laid out flat, each carrying its level. It keeps one item in the tab order (the one last
 * focused, else the selected one, else the first) and moves the focus for the items' arrow keys: next and previous
 * through the visible rows, first and last, a folder's first child and an item's parent.
 */
defineProps<{ label: string }>();

const root = useTemplateRef<HTMLElement>('root');
const active = ref<string | undefined>();

function rows(): HTMLElement[] {
    return Array.from(root.value?.querySelectorAll<HTMLElement>('[role="treeitem"]') ?? []);
}

function levelOf(row: HTMLElement): number {
    return Number(row.getAttribute('aria-level'));
}

function target(list: HTMLElement[], from: HTMLElement, to: TreeMove): HTMLElement | undefined {
    const index = list.indexOf(from);
    const after = list[index + 1];
    const targets: Record<TreeMove, HTMLElement | undefined> = {
        next: after,
        previous: list[index - 1],
        first: list[0],
        last: list.at(-1),
        child: after && levelOf(after) > levelOf(from) ? after : undefined,
        parent: list
            .slice(0, Math.max(index, 0))
            .reverse()
            .find((row) => levelOf(row) < levelOf(from)),
    };

    return targets[to];
}

function move(from: HTMLElement, to: TreeMove): void {
    const row = target(rows(), from, to);

    if (row === undefined) {
        return;
    }

    active.value = row.dataset.key;
    row.focus();
}

function settle(): void {
    const list = rows();

    if (list.some((row) => row.dataset.key === active.value)) {
        return;
    }

    const chosen = list.find((row) => row.getAttribute('aria-selected') === 'true') ?? list[0];

    active.value = chosen?.dataset.key;
}

provide(treeKey, { active, move });
onMounted(settle);
onUpdated(settle);
</script>

<template>
    <div ref="root" role="tree" :aria-label="label">
        <slot />
    </div>
</template>
