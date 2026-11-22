<script setup lang="ts">
import { counted } from '@/kit/format';
import { computed, reactive, useTemplateRef } from 'vue';
import EmptyState from './EmptyState.vue';
import MemoryRow from './MemoryRow.vue';

/**
 * A list of memories, heaviest first, under a header that says how many and what the number means. With `expandable`
 * each row opens to its detail (the panel); without it every row shows its source at once (the window). Up and Down
 * move between the rows' buttons and wrap at the ends. An empty list says "No memories yet".
 */
const props = defineProps<{
    memories: { id: number; weight: number; text: string; detail?: string }[];
    expandable?: boolean;
}>();

const list = useTemplateRef<HTMLElement>('list');
const opened = reactive(new Set<number>());
const heaviestFirst = computed(() => [...props.memories].sort((a, b) => b.weight - a.weight));

function toggle(id: number, isOpen: boolean): void {
    if (isOpen) {
        opened.add(id);

        return;
    }

    opened.delete(id);
}

function onKey(event: KeyboardEvent): void {
    const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];

    if (step === undefined) {
        return;
    }

    const buttons = Array.from(list.value?.querySelectorAll<HTMLElement>('[data-memory-row]') ?? []);
    const index = buttons.indexOf(document.activeElement as HTMLElement);

    if (index === -1) {
        return;
    }

    event.preventDefault();
    buttons[(index + step + buttons.length) % buttons.length].focus();
}
</script>

<template>
    <EmptyState v-if="memories.length === 0" title="No memories yet" />
    <div v-else>
        <p class="px-3.5 py-2 text-badge text-text-3">
            {{ counted(memories.length, 'memory', 'memories') }} · the number is its weight, heaviest first
        </p>
        <ul ref="list" class="m-0 list-none p-0" @keydown="onKey">
            <MemoryRow
                v-for="memory in heaviestFirst"
                :key="memory.id"
                :weight="memory.weight"
                :text="memory.text"
                :detail="memory.detail"
                :expandable="expandable"
                :expanded="opened.has(memory.id)"
                @update:expanded="toggle(memory.id, $event)"
            />
        </ul>
    </div>
</template>
