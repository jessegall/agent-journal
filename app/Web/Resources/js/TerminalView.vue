<script setup lang="ts">
import { router } from '@inertiajs/vue3';
import Button from '@kit/Button';
import { seconds, timeOfDay } from '@kit/format';
import Status from '@kit/Status';
import SwitchCase from '@kit/SwitchCase';
import type { TerminalWindowData } from '@/types/generated';
import { computed, nextTick, ref, toRef, watch } from 'vue';
import TerminalRow from './TerminalRow.vue';
import { useTerminalFrames } from './useTerminalFrames';

/**
 * An agent's live terminal, read only: the screen as the driver draws it, with its colours and cursor, at the
 * driver's own size, and what the view knows about it: its status and size, its age, a silent host, an end or a
 * restart. Interrupt, Restart and End are drawn one by one, only for an action the server offered this viewer; after
 * the session ended the focus goes to Restart when it is offered, else to the link to the current session from Home.
 * Leave terminal, or Option with the backtick, gives the keyboard back by focusing the window switcher.
 */
const props = defineProps<{ data: TerminalWindowData }>();

const { state, refusal, drawn, endedAt, isSilent, ageSeconds } =
    useTerminalFrames(toRef(props, 'data'));

const homeLink = ref<HTMLElement | null>(null);
const restartButton = ref<{ $el: HTMLElement } | null>(null);

const statusState = computed(() => {
    const states: Record<string, 'connecting' | 'ended' | 'restarting' | 'stopped' | 'live'> = {
        opening: 'connecting',
        ended: 'ended',
        restarted: 'restarting',
        refused: 'stopped',
    };

    return states[state.value] ?? 'live';
});
const sizeWords = computed(() =>
    drawn.value === null ? null : `${drawn.value.columns} columns by ${drawn.value.rows.length} rows`,
);

watch(
    () => state.value === 'ended',
    async (hasEnded) => {
        if (!hasEnded) {
            return;
        }

        await nextTick();
        (restartButton.value?.$el ?? homeLink.value)?.focus();
    },
);

function act(address: string): void {
    router.post(address, {}, { preserveScroll: true, headers: { 'Idempotency-Key': crypto.randomUUID() } });
}

function leave(): void {
    document.querySelector<HTMLElement>('[data-window-switcher] [role="radio"], [data-window-switcher] button')?.focus();
}

function leaveByKey(event: KeyboardEvent): void {
    if (event.altKey && (event.key === '`' || event.code === 'Backquote')) {
        event.preventDefault();
        leave();
    }
}

const notices = computed<string[]>(() => {
    const screen = drawn.value;
    const markers: [boolean, string][] = [
        [state.value === 'restarted', 'restarted'],
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
            <div class="flex flex-col gap-1" @keydown="leaveByKey">
                <div class="flex flex-wrap items-center gap-2 text-sm text-text-3">
                    <Status :state="statusState" live />
                    <template v-if="sizeWords !== null">
                        <span>{{ sizeWords }}</span>
                    </template>
                    <span>updated {{ seconds(ageSeconds()) }} ago</span>
                    <span class="flex-1"></span>
                    <template v-if="data.actions?.interrupt !== undefined">
                        <Button size="small" variant="bordered" @click="act(data.actions.interrupt)">Interrupt</Button>
                    </template>
                    <template v-if="data.actions?.restart !== undefined">
                        <Button
                            ref="restartButton"
                            size="small"
                            variant="bordered"
                            @click="act(data.actions.restart)"
                            >Restart</Button
                        >
                    </template>
                    <template v-if="data.actions?.end !== undefined">
                        <Button size="small" variant="danger" @click="act(data.actions.end)">End</Button>
                    </template>
                    <Button class="min-[761px]:hidden" size="small" variant="ghost" @click="leave">Leave terminal</Button>
                </div>
                <template v-if="state === 'ended'">
                    <a ref="homeLink" href="/" class="text-small underline">Open the current session from Home</a>
                </template>
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
