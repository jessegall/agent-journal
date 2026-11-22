<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';

/**
 * The console output of a ProcessCard: a log of lines in mono 11.5/17 on --term in --term-out, padding 8 12, one pre.
 * Collapsed, a running command shows its last 3 lines (max-height 67) and a passed one its last 2 (50); a failed or
 * idle one shows none. Open shows all of them up to max-height 240 and follows the end as lines arrive.
 */
const props = defineProps<{
    id: string;
    lines: string[];
    state: 'waiting-to-start' | 'running' | 'passed' | 'failed' | 'stopped';
    expanded: boolean;
}>();

const box = ref<HTMLElement>();

const collapsedLineCount = computed(() => ({ running: 3, passed: 2 })[props.state as 'running' | 'passed'] ?? 0);
const shownLines = computed(() => (props.expanded ? props.lines : props.lines.slice(-collapsedLineCount.value)));
const isShown = computed(() => props.expanded || (collapsedLineCount.value > 0 && props.lines.length > 0));

watch(
    () => [props.lines.length, props.expanded],
    async () => {
        await nextTick();
        box.value?.scrollTo({ top: box.value.scrollHeight });
    },
);
</script>

<template>
    <div
        v-if="isShown"
        :id="id"
        ref="box"
        role="log"
        aria-label="Command output"
        :tabindex="expanded ? 0 : undefined"
        class="overflow-y-auto bg-term px-3 py-2 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-focus"
        :class="expanded ? 'max-h-60' : collapsedLineCount === 3 ? 'max-h-[67px]' : 'max-h-[50px]'"
    >
        <pre class="m-0 font-mono text-badge leading-[17px] whitespace-pre-wrap text-term-out">{{ shownLines.join('\n') }}</pre>
    </div>
</template>
