<script setup lang="ts">
import { computed } from 'vue';
import FoundList from './FoundList.vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';
import QuietLine from './QuietLine.vue';

/**
 * One action an agent took: as a row of the activity panel its time, level glyph, icon and who did what, or as a
 * QuietLine in the chat. An item with found lines is a button that shows its FoundList. Measures:
 * docs/designs/kit-components.md.
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
const levelText = computed(() => ({ 3: 'text-text', 2: 'text-text-2', 1: 'text-text-3' })[props.level]);
const hasFound = computed(() => props.found.length > 0);
const toggle = (): void => {
    if (hasFound.value) {
        expanded.value = !expanded.value;
    }
};
</script>

<template>
    <li>
        <template v-if="density === 'line'">
            <QuietLine
                :icon="icon"
                :expanded="hasFound ? expanded : undefined"
                @click="toggle"
            >
                <b>{{ who }}</b> {{ text }}
            </QuietLine>
        </template>
        <template v-else>
            <component
                :is="hasFound ? 'button' : 'div'"
                :type="hasFound ? 'button' : undefined"
                :aria-expanded="hasFound ? expanded : undefined"
                class="flex w-full items-center gap-2 px-3 py-1.25 text-left text-small hover:bg-hover focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
                :class="levelText"
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
        </template>
        <template v-if="hasFound && expanded">
            <FoundList :lines="found" :label="`Found by ${who}`" />
        </template>
    </li>
</template>
