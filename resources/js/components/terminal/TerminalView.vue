<script setup lang="ts">
import Textarea from '@kit/Textarea';
import { computed, ref, useId, watch } from 'vue';
import Button from '@kit/Button';
import TerminalRow from './TerminalRow.vue';
import type { TerminalPresentation } from './useTerminalController';

/**
 * An agent's terminal, drawn only: the line saying what the screen is, the notices about it, the actions its window
 * offers for that state, and the screen as the driver draws it, with its colours and cursor, at the driver's own size.
 * Only the screen is monospaced. Read screen opens a plain-text snapshot of the rows that holds still until Refresh,
 * and goes together with the pixels when the screen clears. A change of state is announced once, a failure as an
 * alert; frames are never announced. It reads nothing itself.
 */
const props = defineProps<{ presentation: TerminalPresentation }>();

const screen = computed(() => props.presentation.screen);
const drawn = computed(() => screen.value.frame);

const readerId = useId();
const snapshot = ref<string | null>(null);

function snapshotText(): string {
    const rows = (drawn.value?.rows ?? []).map((row) => row.runs.map((run) => run.text).join('')).join('\n');
    const menu = drawn.value?.menu;

    if (menu === undefined || menu === null) {
        return rows;
    }

    const options = menu.labels.map((label, index) => `${index === menu.highlighted ? '(highlighted) ' : ''}${label}`);

    return `${rows}\n\nMenu options:\n${options.join('\n')}`;
}

function readScreen(): void {
    snapshot.value = snapshotText();
}

/**
 * Leave terminal, or Option with the backtick, hands the keyboard back by focusing the window switcher.
 */
function leave(): void {
    document.querySelector<HTMLElement>('[data-window-switcher] [role="radio"], [data-window-switcher] button')?.focus();
}

function leaveByKey(event: KeyboardEvent): void {
    if (event.altKey && (event.key === '`' || event.code === 'Backquote')) {
        event.preventDefault();
        leave();
    }
}

function closeReader(): void {
    snapshot.value = null;
}

watch(drawn, (frame) => {
    if (frame === null) {
        closeReader();
    }
});

const announcement = computed(
    () =>
        ({
            opening: '',
            refused: '',
            live: screen.value.reconnecting ? '' : 'Watching the terminal',
            last_reported: 'The terminal shows its last reported screen',
            preview_unavailable: 'Terminal preview unavailable',
            not_reporting: '',
            connection_lost: 'Terminal connection lost',
            ended: 'Session ended',
        })[screen.value.state],
);
const alert = computed(() => {
    if (screen.value.state === 'refused') {
        return screen.value.refusal;
    }
    if (screen.value.state === 'not_reporting') {
        return "The agent's host stopped reporting";
    }

    return screen.value.reconnecting ? 'The terminal is reconnecting' : '';
});

const cursorStyle = computed(() => {
    const cursor = drawn.value?.cursor;

    return cursor === undefined || !cursor.visible
        ? { display: 'none' }
        : { left: `${cursor.column}ch`, top: `${cursor.row}lh` };
});
</script>

<template>
    <div class="flex flex-col gap-1" @keydown="leaveByKey">
        <p class="text-small" :class="screen.state === 'refused' ? 'text-danger' : 'text-text-2'">
            {{ presentation.stateLine }}
        </p>
        <template v-for="notice in presentation.notices" :key="notice">
            <p class="text-small text-warn">{{ notice }}</p>
        </template>
        <p role="status" aria-live="polite" class="sr-only">{{ announcement }}</p>
        <p role="alert" class="sr-only">{{ alert }}</p>
        <div class="flex flex-wrap gap-1.5">
            <slot name="actions" :state="screen.state" />
            <template v-if="drawn !== null">
                <Button variant="bordered" size="sm" :aria-controls="readerId" @click="readScreen">Read screen</Button>
            </template>
            <Button class="min-[761px]:hidden" variant="ghost" size="sm" @click="leave">Leave terminal</Button>
        </div>
        <template v-if="snapshot !== null">
            <section :id="readerId" class="flex flex-col gap-1.5" aria-label="Terminal screen as text">
                <div class="flex gap-1.5">
                    <Button variant="bordered" size="sm" @click="readScreen">Refresh</Button>
                    <Button variant="ghost" size="sm" @click="closeReader">Close reader</Button>
                </div>
                <Textarea
                    class="max-h-[40vh] w-full font-mono text-small"
                    readonly
                    :model-value="snapshot"
                    aria-label="Terminal screen as text"
                />
            </section>
        </template>
        <template v-if="screen.restarted">
            <p class="border-t border-border-2 pt-1 text-small text-text-3" role="separator">Restarted</p>
        </template>
        <template v-if="drawn !== null">
            <div class="terminal max-h-[70vh] max-w-full overflow-auto rounded">
                <pre
                    class="relative m-0 font-mono leading-tight"
                    :class="{ 'opacity-60': screen.state === 'ended' }"
                    :style="{ width: `${drawn.columns}ch` }"
                    aria-label="Agent terminal, read only"
                ><template v-for="(row, index) in drawn.rows" :key="index"
                    ><TerminalRow :runs="row.runs" :plain="drawn.plain" /></template
                ><span class="cursor absolute h-[1lh] w-[1ch]" :style="cursorStyle" /></pre>
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
