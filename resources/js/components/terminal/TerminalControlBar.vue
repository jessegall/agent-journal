<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import Button from '@/components/kit/Button.vue';
import type { TerminalScreenIdentityData } from '@generated/types/core';
import { PASTE_BYTE_LIMIT } from './terminalControl';
import TerminalStopAction from './TerminalStopAction.vue';
import type { TerminalControlHandle } from './useTerminalControl';

/**
 * The terminal's control: one primary action for where control stands, the line the writer types into while they
 * hold it, the choices for an unfinished line when they give it back, this tab's saved drafts, and Stop beside them.
 * F6 or Shift+Tab leaves the line for the Terminal controls button.
 */
const props = defineProps<{
    control: TerminalControlHandle;
    otherViewControls: boolean;
    agentId: string;
    identity: TerminalScreenIdentityData | null;
}>();

const emit = defineEmits<{ owner: [label: string] }>();

const typed = ref('');
const line = ref<HTMLInputElement | null>(null);
const controlsButton = ref<HTMLElement | null>(null);
const view = computed(() => props.control.view.value);

const ownerLabel = computed(() => {
    if (view.value.state === 'controlling' || view.value.state === 'choosing' || view.value.state === 'uncertain') {
        return 'You control the terminal';
    }

    return props.otherViewControls ? 'Another view controls the terminal' : 'Watching';
});

watch(ownerLabel, (label) => emit('owner', label), { immediate: true });

watch(
    () => view.value.state,
    async (state) => {
        if (state === 'controlling') {
            await nextTick();
            line.value?.focus();
        }
    },
);

/**
 * The named key a keystroke sends to the driver, or none when the line edits it locally or it leaves the line.
 */
const keyNames: Record<string, string> = {
    ArrowUp: 'up',
    ArrowDown: 'down',
    ArrowLeft: 'left',
    ArrowRight: 'right',
    Home: 'home',
    End: 'end',
    PageUp: 'page_up',
    PageDown: 'page_down',
    Tab: 'tab',
    Escape: 'escape',
};

function namedKeyOf(event: KeyboardEvent): string | null {
    if (event.ctrlKey && !event.metaKey && /^[a-z]$/i.test(event.key)) {
        return `ctrl_${event.key.toLowerCase()}`;
    }
    if ((event.key === 'Backspace' || event.key === 'Delete') && typed.value === '') {
        return event.key.toLowerCase();
    }

    return keyNames[event.key] ?? null;
}

const isComposing = ref(false);

function submit(event: KeyboardEvent): void {
    if (isComposing.value || event.isComposing) {
        return;
    }
    if (event.key === 'F6' || (event.key === 'Tab' && event.shiftKey)) {
        event.preventDefault();
        controlsButton.value?.focus();

        return;
    }
    if (event.key === 'Enter') {
        event.preventDefault();
        void props.control.send(typed.value, true);
        typed.value = '';

        return;
    }

    const key = namedKeyOf(event);

    if (key === null) {
        return;
    }

    event.preventDefault();
    event.stopPropagation();
    void props.control.sendKey(key);
}

/**
 * The paste waiting for the writer's confirmation, with the prompt revision it was made under; it lives in memory
 * only and goes when the prompt changes.
 */
const preview = ref<{ text: string; lines: number; revision: number } | null>(null);
const pasteRefusal = ref('');

function onPaste(event: ClipboardEvent): void {
    const text = event.clipboardData?.getData('text/plain') ?? '';
    event.preventDefault();
    pasteRefusal.value = '';

    if (new TextEncoder().encode(text).length > PASTE_BYTE_LIMIT) {
        pasteRefusal.value = `A paste may be at most ${PASTE_BYTE_LIMIT} bytes; nothing was sent.`;

        return;
    }
    // eslint-disable-next-line no-control-regex
    if (!/[\u0000-\u001f\u007f]/.test(text)) {
        void props.control.paste(text);

        return;
    }

    preview.value = { text, lines: text.split('\n').length, revision: props.control.promptRevision() };
}

function confirmPaste(): void {
    const shown = preview.value;
    preview.value = null;

    if (shown === null || shown.revision !== props.control.promptRevision()) {
        return;
    }

    void props.control.paste(shown.text);
}

/**
 * An input method's text stays local while it is composed; the committed text joins the line, which Enter sends once.
 */
function onCompositionEnd(): void {
    isComposing.value = false;
}

watch(
    () => [props.identity?.privacyRevision, props.control.promptRevision()],
    () => {
        preview.value = null;
        typed.value = '';
        isComposing.value = false;
    },
);

function sendWithoutEnter(): void {
    if (typed.value === '') {
        return;
    }

    void props.control.send(typed.value, false);
    typed.value = '';
}

async function copy(text: string): Promise<void> {
    await navigator.clipboard.writeText(text);
}
</script>

<template>
    <div class="flex flex-col gap-1.5" aria-label="Terminal controls" role="group">
        <div class="flex flex-wrap items-center gap-1.5">
            <span ref="controlsButton" tabindex="-1" class="text-small text-text-2">{{ ownerLabel }}</span>
            <template v-if="view.state === 'watching' && !otherViewControls && control.mayTake()">
                <Button variant="primary" size="sm" @click="control.take()">Take control</Button>
            </template>
            <template v-if="view.state === 'requesting'">
                <span class="text-small text-text-2">Requesting control…</span>
                <Button variant="bordered" size="sm" @click="control.cancel()">Cancel</Button>
            </template>
            <template v-if="view.state === 'controlling'">
                <Button variant="primary" size="sm" @click="control.giveBack()">Give back</Button>
            </template>
            <template v-if="view.state === 'releasing'">
                <span class="text-small text-text-2">Releasing control…</span>
            </template>
            <template v-if="view.state === 'uncertain'">
                <Button variant="primary" size="sm" @click="control.check()">Check screen</Button>
            </template>
            <template v-if="view.state === 'watch_only'">
                <span class="text-small text-text-2">You can watch this terminal.</span>
            </template>
            <template v-if="identity !== null && view.state !== 'watch_only'">
                <TerminalStopAction :agent-id="agentId" :identity="identity" />
            </template>
        </div>
        <template v-if="view.geometry && view.state === 'controlling'">
            <p class="text-small text-text-3">Terminal size: {{ view.geometry }}</p>
        </template>
        <template v-if="view.notice">
            <p class="text-small text-warn" role="status">{{ view.notice }}</p>
        </template>
        <template v-if="view.state === 'controlling'">
            <div class="flex gap-1.5">
                <input
                    ref="line"
                    v-model="typed"
                    class="min-w-0 flex-1 rounded border border-border-2 bg-bg px-2 py-1 font-mono text-small"
                    aria-label="Type into the terminal; Enter sends the line"
                    autocomplete="off"
                    spellcheck="false"
                    @keydown="submit"
                    @paste="onPaste"
                    @compositionstart="isComposing = true"
                    @compositionend="onCompositionEnd"
                />
                <Button variant="bordered" size="sm" @click="sendWithoutEnter">Type without Enter</Button>
                <Button variant="ghost" size="sm" @click="control.sendKey('shift_tab')">
                    Send Shift+Tab to driver
                </Button>
            </div>
            <template v-if="pasteRefusal">
                <p class="text-small text-warn" role="alert">{{ pasteRefusal }}</p>
            </template>
            <template v-if="preview">
                <section class="flex flex-col gap-1.5" aria-label="Paste preview">
                    <p class="text-small text-text-2">
                        This paste has {{ preview.lines }} lines; each line break may run a command in the terminal.
                    </p>
                    <pre class="max-h-40 overflow-auto rounded border border-border-2 p-2 text-small">{{
                        preview.text
                    }}</pre>
                    <div class="flex gap-1.5">
                        <Button variant="primary" size="sm" @click="confirmPaste">Paste it</Button>
                        <Button variant="ghost" size="sm" @click="preview = null">Cancel</Button>
                    </div>
                </section>
            </template>
        </template>
        <template v-if="view.state === 'choosing'">
            <div class="flex flex-col gap-1.5" role="group" aria-label="The unfinished line">
                <p class="text-small text-text-2">The terminal still has an unfinished line: {{ view.unsentLine }}</p>
                <div class="flex flex-wrap gap-1.5">
                    <Button variant="bordered" size="sm" @click="control.keepTyping()">Keep typing</Button>
                    <Button variant="bordered" size="sm" @click="control.choose('send')">Send it</Button>
                    <Button variant="bordered" size="sm" @click="control.choose('save-and-clear')">
                        Save and clear
                    </Button>
                </div>
                <p class="text-small text-text-3">
                    Send presses Enter on the line; Save and clear keeps it in this tab only and empties the prompt.
                </p>
            </div>
        </template>
        <template v-if="view.savedDrafts.length > 0">
            <section class="flex flex-col gap-1" aria-label="Saved draft">
                <template v-for="(draft, index) in view.savedDrafts" :key="index">
                    <div class="flex items-center gap-1.5">
                        <code class="min-w-0 flex-1 truncate text-small">{{ draft }}</code>
                        <Button variant="ghost" size="sm" @click="copy(draft)">Copy</Button>
                        <Button variant="ghost" size="sm" @click="control.deleteSavedDraft(index)">Delete</Button>
                    </div>
                </template>
            </section>
        </template>
    </div>
</template>
