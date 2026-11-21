<script setup lang="ts">
import Button from '@kit/Button';
import { ref, watch } from 'vue';

/**
 * An issued install line in a read-only field with one Copy action, which copies exactly the bytes shown, and when
 * the line expires. Copied shows once the clipboard took this very line; a refused clipboard leaves the line selectable
 * with how to copy it by hand.
 */
const props = defineProps<{ line: string; expiresAt: string }>();

type CopyState = 'idle' | 'copied' | 'refused';

const state = ref<CopyState>('idle');

watch(
    () => props.line,
    () => (state.value = 'idle'),
);

async function copy(): Promise<void> {
    const copying = props.line;

    try {
        await navigator.clipboard.writeText(copying);
    } catch {
        state.value = copying === props.line ? 'refused' : state.value;
        return;
    }

    // A copy that finishes after the line was replaced says nothing about the line shown now.
    if (copying === props.line) {
        state.value = 'copied';
    }
}
</script>

<template>
    <div class="flex flex-col gap-2">
        <div class="flex items-center gap-2">
            <input
                class="min-w-0 flex-1 h-7 rounded-control border border-border-2 bg-code-bg px-2.5 font-mono text-small text-text"
                :value="line"
                readonly
                spellcheck="false"
                autocomplete="off"
                aria-label="Install line"
                @focus="($event.target as HTMLInputElement).select()"
            />
            <Button variant="primary" size="small" @click="copy">{{
                state === 'copied' ? 'Copied' : 'Copy'
            }}</Button>
        </div>
        <p class="sr-only" aria-live="polite">{{ state === 'copied' ? 'Copied' : '' }}</p>
        <template v-if="state === 'refused'">
            <p class="text-small text-danger">
                This browser did not let the journal copy the line. Select the line
                above and copy it with your keyboard.
            </p>
        </template>
        <p class="text-small text-muted">
            Paste it in a terminal in the project folder. It works once, until
            {{ new Date(expiresAt).toLocaleTimeString() }}.
        </p>
    </div>
</template>
