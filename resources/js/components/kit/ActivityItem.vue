<script setup lang="ts">
import { computed } from 'vue';
import FoundList from './FoundList.vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';
import QuietLine from './QuietLine.vue';

/**
 * One thing an agent did. Row (the activity panel): the time (38 wide), a level glyph 10 (● reaches the chat, ○ the
 * panel, · only detail), the kind's Icon 14, and who and what, padding 5 12 in --text-small --text-2; level 3 reads in
 * --text and level 1 in --text-3. Line (the chat): a QuietLine. An item with found lines is a button with aria-expanded
 * that shows its FoundList; hover takes --hover and the ring sits inside at offset -2.
 */
const props = withDefaults(
    defineProps<{
        density: 'row' | 'line';
        time: string;
        level: 1 | 2 | 3;
        icon: IconName;
        who: string;
        text: string;
        found?: string[];
    }>(),
    { found: () => [] },
);

const expanded = defineModel<boolean>('expanded', { default: false });

const glyph = computed(() => ({ 3: '●', 2: '○', 1: '·' })[props.level]);
const levelWords = computed(() => ({ 3: 'Reaches the chat', 2: 'In the panel', 1: 'Detail' })[props.level]);
const hasFound = computed(() => props.found.length > 0);
const toggle = (): void => {
    if (hasFound.value) {
        expanded.value = !expanded.value;
    }
};
</script>

<template>
    <li>
        <QuietLine
            v-if="density === 'line'"
            :icon="icon"
            :expanded="hasFound ? expanded : undefined"
            @click="toggle"
        >
            <b>{{ who }}</b> {{ text }}
        </QuietLine>
        <component
            :is="hasFound ? 'button' : 'div'"
            v-else
            :type="hasFound ? 'button' : undefined"
            :aria-expanded="hasFound ? expanded : undefined"
            class="flex w-full items-center gap-2 px-3 py-1.25 text-left text-small hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
            :class="level === 3 ? 'text-text' : level === 1 ? 'text-text-3' : 'text-text-2'"
            @click="toggle"
        >
            <span class="w-9.5 shrink-0 text-text-3 tabular-nums">{{ time }}</span>
            <span aria-hidden="true" class="w-2.5 shrink-0 text-center text-text-3">{{ glyph }}</span>
            <span class="sr-only">{{ levelWords }}</span>
            <Icon :name="icon" :size="14" class="shrink-0 text-text-3" />
            <span class="min-w-0"
                ><b class="font-medium">{{ who }}</b> {{ text }}</span
            >
        </component>
        <FoundList v-if="hasFound && expanded" :lines="found" :label="`Found by ${who}`" />
    </li>
</template>
