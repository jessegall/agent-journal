<script setup lang="ts">
import { seconds, timeOfDay } from '@kit/format';
import SwitchCase from '@kit/SwitchCase';
import type { TerminalWindowData } from '@/types/generated';
import { computed, toRef } from 'vue';
import TerminalRow from './TerminalRow.vue';
import { useTerminalFrames } from './useTerminalFrames';

/**
 * An agent's live terminal, read only: the screen as the driver draws it, with its colours and cursor, at the
 * driver's own size, and what the view knows about it: its age, a silent host, an end or a restart.
 */
const props = defineProps<{ data: TerminalWindowData }>();

const { state, refusal, drawn, endedAt, isSilent, ageSeconds } =
    useTerminalFrames(toRef(props, 'data'));

const notices = computed<string[]>(() => {
    const screen = drawn.value;
    const markers: [boolean, string][] = [
        [state.value === 'restarted', 'restarted'],
        [state.value === 'preview_unavailable', 'Terminal preview unavailable'],
        [
            state.value === 'last_reported',
            `last reported ${seconds(ageSeconds())} ago; this host does not show a live screen`,
        ],
        [
            state.value === 'ended',
            `this session ended at ${timeOfDay(endedAt.value)}; open the current one from Home`,
        ],
        [
            isSilent(),
            `the agent's host is not reporting; no update for ${Math.round(ageSeconds())} s`,
        ],
        [
            screen !== null && screen.noTerminal,
            "the agent's terminal is not running on its host",
        ],
        [screen !== null && screen.tooLarge, 'screen too large to show'],
        [screen !== null && screen.unreadable, 'the screen cannot be read'],
        [screen !== null && screen.plain, 'shown without colours'],
    ];

    return markers.filter(([shown]) => shown).map(([, text]) => text);
});

const cursorStyle = computed(() => {
    const cursor = drawn.value?.cursor;

    return cursor === undefined || !cursor.visible
        ? { display: 'none' }
        : { left: `${cursor.column}ch`, top: `${cursor.row}lh` };
});
</script>

<template>
    <SwitchCase :value="state">
        <template #opening>
            <p class="text-text-3">Opening the terminal…</p>
        </template>
        <template #refused>
            <p class="text-warn">{{ refusal }}</p>
        </template>
        <template #default>
            <div class="flex flex-col gap-1">
                <p class="text-sm text-text-3">
                    updated {{ seconds(ageSeconds()) }} ago
                </p>
                <template v-for="notice in notices" :key="notice">
                    <p class="text-warn text-sm">{{ notice }}</p>
                </template>
                <div
                    class="terminal max-h-[70vh] max-w-full overflow-auto rounded"
                >
                    <template v-if="drawn !== null">
                        <pre
                            class="relative m-0 font-mono leading-tight"
                            :class="{
                                'opacity-50': isSilent() || state === 'ended',
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
