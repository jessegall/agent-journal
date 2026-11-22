<script setup lang="ts">
import { computed, nextTick, ref, watch } from 'vue';
import Button from '@/components/kit/Button.vue';
import type { TerminalScreenIdentityData } from '@generated/types/core';
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

function submit(event: KeyboardEvent): void {
    if (event.key === 'Enter') {
        event.preventDefault();
        void props.control.send(typed.value, true);
        typed.value = '';

        return;
    }

    if (event.key === 'F6' || (event.key === 'Tab' && event.shiftKey)) {
        event.preventDefault();
        controlsButton.value?.focus();
    }
}

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
            <template v-if="view.state === 'watching' && !otherViewControls">
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
                />
                <Button variant="bordered" size="sm" @click="sendWithoutEnter">Type without Enter</Button>
            </div>
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
