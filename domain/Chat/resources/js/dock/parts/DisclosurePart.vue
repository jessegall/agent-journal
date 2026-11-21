<script setup lang="ts">
import type { DisclosureNode } from '@kit/dockCards';
import DockPart from '../DockPart.vue';
import { useDockFolds } from '../dockFolds';

/**
 * An expandable heading over its body, open or shut as the source declared until the user folds it; the user's own
 * fold is kept by the card's path, so a refresh keeps it.
 */
const props = defineProps<{ node: DisclosureNode; path: string }>();
const { folds, fold } = useDockFolds();

function toggled(event: Event): void {
    fold(props.path, (event.target as HTMLDetailsElement).open);
}
</script>

<template>
    <details :open="folds[path] ?? node.initial === 'open'" @toggle="toggled">
        <summary class="cursor-pointer text-small font-medium text-text-2">{{ node.title }}</summary>
        <div class="mt-1 flex flex-col gap-1 pl-3">
            <template v-for="child in node.children" :key="child.key">
                <DockPart
                    :node="child"
                    :path="`${path}/${child.key}`"
                />
            </template>
        </div>
    </details>
</template>
