<script setup lang="ts">
import { computed, ref } from 'vue';
import Button from '@/components/kit/Button.vue';
import CodeLine from '@/components/kit/CodeLine.vue';
import Menu from '@/components/kit/Menu.vue';
import MenuItem from '@/components/kit/MenuItem.vue';

/**
 * One file as numbered code lines with a focusable gutter, in a theme chosen in its own window. A Markdown file offers
 * the document reader instead, a failed read offers Retry, and a window that takes comments draws its lines in the
 * lines slot.
 */
const props = defineProps<{
    name: string;
    lines: string[];
    isMarkdown: boolean;
    state: 'ready' | 'failed';
}>();

const emit = defineEmits<{ retry: []; openReader: [] }>();

// A line is known by its number in the file.
const lineNumbers = computed(() => props.lines.map((_, index) => index + 1));

const themes = { dark: 'Dark', light: 'Light' } as const;
const theme = ref<keyof typeof themes>('dark');
const palette: Record<keyof typeof themes, Record<string, string>> = {
    dark: { '--code-bg': '#1b1a19', '--code-gutter': '#8a8580', color: '#e8e6e3' },
    light: { '--code-bg': '#f6f5f3', '--code-gutter': '#8a8580', color: '#262422' },
};
</script>

<template>
    <section :aria-label="name" class="flex min-h-0 flex-col">
        <template v-if="state === 'failed'">
            <div role="alert" class="flex flex-col items-start gap-2 p-4 text-body text-text-2">
                <p>{{ name }} could not be read.</p>
                <Button variant="bordered" size="small" @click="emit('retry')">Retry</Button>
            </div>
        </template>
        <template v-else-if="isMarkdown">
            <div class="flex flex-col items-start gap-2 p-4 text-body text-text-2">
                <p>{{ name }} is a Markdown file.</p>
                <Button variant="bordered" size="small" @click="emit('openReader')">Open in the document reader</Button>
            </div>
        </template>
        <template v-else>
            <div class="flex items-center gap-2 border-b border-border px-3 py-1.5 text-small text-text-3">
                <span class="min-w-0 flex-1 truncate">{{ name }}</span>
                <Menu
                    label="Code theme"
                    align="right"
                    class="shrink-0"
                    trigger-class="h-7 gap-1 rounded-button px-2 text-text-3 hover:bg-hover hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                >
                    <template #trigger>
                        <span class="whitespace-nowrap">Theme: {{ themes[theme] }}</span>
                    </template>
                    <template v-for="(label, key) in themes" :key="key">
                        <MenuItem radio :checked="theme === key" @click="theme = key">{{ label }}</MenuItem>
                    </template>
                </Menu>
            </div>
            <div class="min-h-0 flex-1 overflow-auto bg-code-bg py-2" :style="palette[theme]">
                <slot name="lines">
                    <template v-for="line in lineNumbers" :key="line">
                        <CodeLine :line="line">{{ lines[line - 1] }}</CodeLine>
                    </template>
                </slot>
            </div>
        </template>
    </section>
</template>
