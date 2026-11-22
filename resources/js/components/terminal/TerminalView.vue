<script setup lang="ts">
import { seconds } from '@kit/format';
import SwitchCase from '@kit/SwitchCase';
import { computed } from 'vue';
import TerminalRow from './TerminalRow.vue';
import type { TerminalPresentation } from './useTerminalController';

/**
 * An agent's terminal, drawn only: the screen as the driver draws it, with its colours and cursor, at the driver's own
 * size, and the notices its controller gives. It reads nothing itself.
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
    <SwitchCase :value="screen.state">
        <template #opening>
            <p class="text-text-3">Opening the terminal…</p>
        </template>
        <template #refused>
            <p class="text-warn">{{ screen.refusal }}</p>
        </template>
        <template #default>
            <div class="flex flex-col gap-1">
                <p class="text-sm text-text-3">
                    updated {{ seconds(presentation.ageSeconds) }} ago
                </p>
                <template v-for="notice in presentation.notices" :key="notice">
                    <p class="text-warn text-sm">{{ notice }}</p>
                </template>
                <div
                    class="terminal max-h-[70vh] max-w-full overflow-auto rounded"
                >
                    <template v-if="drawn !== null">
                        <pre
                            class="relative m-0 font-mono leading-tight"
                            :class="{
                                'opacity-50': screen.state === 'ended',
                            }"
                            :style="{ width: `${drawn.columns}ch` }"
                            aria-label="Agent terminal, read only"
                        ><template v-for="(row, index) in drawn.rows" :key="index">
    <TerminalRow
                            :runs="row.runs"
                            :plain="drawn.plain"
                        />
  </template><span class="cursor absolute h-[1lh] w-[1ch]" :style="cursorStyle" /></pre>
                    </template>
                </div>
            </div>
        </template>
    </SwitchCase>
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
