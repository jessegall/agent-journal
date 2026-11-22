<script setup lang="ts">
import { computed } from 'vue';
import TerminalRow from './TerminalRow.vue';
import type { TerminalPresentation } from './useTerminalController';

/**
 * An agent's terminal, drawn only: the line saying what the screen is, the notices about it, the actions its window
 * offers for that state, and the screen as the driver draws it, with its colours and cursor, at the driver's own size.
 * Only the screen is monospaced. It reads nothing itself.
 */
const props = defineProps<{ presentation: TerminalPresentation }>();

const screen = computed(() => props.presentation.screen);
const drawn = computed(() => screen.value.frame);

const cursorStyle = computed(() => {
    const cursor = drawn.value?.cursor;

    return cursor === undefined || !cursor.visible
        ? { display: 'none' }
        : { left: `${cursor.column}ch`, top: `${cursor.row}lh` };
});
</script>

<template>
    <div class="flex flex-col gap-1">
        <p class="text-small" :class="screen.state === 'refused' ? 'text-danger' : 'text-text-2'">
            {{ presentation.stateLine }}
        </p>
        <template v-for="notice in presentation.notices" :key="notice">
            <p class="text-small text-warn">{{ notice }}</p>
        </template>
        <div class="flex flex-wrap gap-1.5">
            <slot name="actions" :state="screen.state" />
        </div>
        <template v-if="drawn !== null">
            <div class="terminal max-h-[70vh] max-w-full overflow-auto rounded">
                <pre
                    class="relative m-0 font-mono leading-tight"
                    :class="{ 'opacity-60': screen.state === 'ended' }"
                    :style="{ width: `${drawn.columns}ch` }"
                    aria-label="Agent terminal, read only"
                ><template v-for="(row, index) in drawn.rows" :key="index">
    <TerminalRow
                    :runs="row.runs"
                    :plain="drawn.plain"
                />
  </template><span class="cursor absolute h-[1lh] w-[1ch]" :style="cursorStyle" /></pre>
            </div>
        </template>
    </div>
</template>

<style scoped>
.terminal {
    --terminal-fg: #d4d4d4;
    --terminal-bg: #111111;
    color: var(--terminal-fg);
    background-color: var(--terminal-bg);
}

.cursor {
    background-color: var(--terminal-fg);
    mix-blend-mode: difference;
}
</style>
