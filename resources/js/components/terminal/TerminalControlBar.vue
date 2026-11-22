<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import Button from '@/components/kit/Button.vue';
import type { ScreenMenuData, TerminalScreenIdentityData } from '@generated/types/core';
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
    // The recognized menu the shown screen holds, with its labels and highlight.
    menu: ScreenMenuData | null;
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

/**
 * The private value as it is typed: only in this field's memory, masked, gone on submit, cancel or any change of
 * state; it never enters the paste preview, the line or a saved draft.
 */
const privateValue = ref('');
const privateButton = ref<HTMLElement | null>(null);
const privateField = ref<HTMLInputElement | null>(null);

function submitPrivate(): void {
    const value = privateValue.value;
    privateValue.value = '';
    void props.control.submitPrivate(value);
    privateButton.value?.focus();
}

function cancelPrivate(): void {
    privateValue.value = '';
    void props.control.cancelPrivate();
    (privateButton.value ?? controlsButton.value)?.focus();
}

/**
 * The menu choice: Previous option and Next option send one arrow each; Confirm is enabled only for the highlight the
 * screen showed after the last move, at that same revision, never for a count of presses.
 */
const awaitingHighlight = ref(false);
const seen = ref<{ label: string; revision: number } | null>(null);
const highlightedLabel = computed(() => {
    const menu = props.menu;

    return menu === null || menu.highlighted < 0 ? '' : (menu.labels[menu.highlighted] ?? '');
});

function moveHighlight(key: 'up' | 'down'): void {
    seen.value = null;
    awaitingHighlight.value = true;
    void props.control.sendKey(key);
}

watch(
    () => [props.menu?.revision, props.menu?.highlighted],
    () => {
        const menu = props.menu;

        if (menu === null || menu.highlighted < 0) {
            seen.value = null;

            return;
        }
        if (awaitingHighlight.value || seen.value === null) {
            seen.value = { label: highlightedLabel.value, revision: menu.revision };
            awaitingHighlight.value = false;
        }
    },
    { immediate: true },
);

const mayConfirm = computed(
    () =>
        props.menu !== null &&
        seen.value !== null &&
        !awaitingHighlight.value &&
        props.menu.revision === seen.value.revision &&
        highlightedLabel.value === seen.value.label,
);

function confirmChoice(): void {
    if (!mayConfirm.value) {
        return;
    }

    void props.control.send('', true);
    seen.value = null;
}

// Keys typed while control was gone are dropped, never replayed, and a private value never outlives its field.
watch(
    () => view.value.state,
    async (state) => {
        if (state !== 'controlling') {
            typed.value = '';
            preview.value = null;
            isComposing.value = false;
        }
        if (state !== 'private') {
            privateValue.value = '';

            return;
        }
        await nextTick();
        privateField.value?.focus();
    },
);

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
                <template v-if="view.unsentLine === ''">
                    <Button variant="primary" size="sm" @click="control.take()">Take control</Button>
                </template>
                <template v-else>
                    <span class="text-small text-text-2">Unfinished input</span>
                    <Button variant="primary" size="sm" @click="control.take()">Resolve</Button>
                </template>
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
                <span ref="privateButton" tabindex="-1">
                    <Button variant="bordered" size="sm" :disabled="!view.privateEntry" @click="control.openPrivate()">
                        Private input
                    </Button>
                </span>
            </div>
            <template v-if="!view.privateEntry">
                <p class="text-small text-text-3">
                    Private input is unavailable: this driver and host have not proved they can keep a secret off every
                    screen and recording.
                </p>
            </template>
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
        <template v-if="view.state === 'private_opening'">
            <p class="text-small text-text-2">Shielding the screen before private input…</p>
        </template>
        <template v-if="view.state === 'private'">
            <form class="flex gap-1.5" aria-label="Private input" @submit.prevent="submitPrivate">
                <input
                    ref="privateField"
                    v-model="privateValue"
                    type="password"
                    class="min-w-0 flex-1 rounded border border-border-2 bg-bg px-2 py-1 text-small"
                    aria-label="Private input; it is sent once and kept nowhere"
                    autocomplete="off"
                    @paste.stop
                />
                <Button variant="primary" size="sm" type="submit">Send privately</Button>
                <Button variant="ghost" size="sm" @click="cancelPrivate">Cancel</Button>
            </form>
        </template>
        <template v-if="menu !== null">
            <section class="flex flex-col gap-1.5" aria-label="Driver menu">
                <ul class="flex flex-col text-small">
                    <template v-for="(label, index) in menu.labels" :key="`${index}:${label}`">
                        <li :class="index === menu.highlighted ? 'font-semibold text-text' : 'text-text-2'">
                            {{ index === menu.highlighted ? '› ' : '  ' }}{{ label }}
                        </li>
                    </template>
                </ul>
                <p class="sr-only" role="status" aria-live="polite">
                    {{ highlightedLabel ? `Highlighted: ${highlightedLabel}` : '' }}
                </p>
                <template v-if="menu.highlighted < 0">
                    <p class="text-small text-warn">The highlighted option cannot be told; refresh or go back.</p>
                </template>
                <template v-if="view.state === 'controlling'">
                    <div class="flex flex-wrap gap-1.5">
                        <Button variant="bordered" size="sm" @click="moveHighlight('up')">Previous option</Button>
                        <Button variant="bordered" size="sm" @click="moveHighlight('down')">Next option</Button>
                        <Button variant="primary" size="sm" :disabled="!mayConfirm" @click="confirmChoice">
                            Confirm {{ mayConfirm ? highlightedLabel : '' }}
                        </Button>
                        <Button variant="ghost" size="sm" @click="control.check()">Refresh</Button>
                    </div>
                </template>
            </section>
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
