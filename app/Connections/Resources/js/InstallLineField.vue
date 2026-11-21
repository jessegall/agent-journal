<script setup lang="ts">
import { timeOfDay } from '@kit/format';
import Button from '@kit/Button';
import { ref, watch } from 'vue';

/**
 * An issued install line in a read-only field with one Copy action, which copies exactly the bytes shown, and when
 * the line expires. Copied shows once the clipboard took this very line; a refused clipboard leaves the line selectable
 * with how to copy it by hand.
 */
const props = withDefaults(defineProps<{ line: string; expiresAt: string; isFresh?: boolean }>(), { isFresh: true });

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
                class="input h-7 flex-1 bg-code-bg font-mono text-small"
                :value="line"
                readonly
                spellcheck="false"
                autocomplete="off"
                aria-label="Install line"
                @focus="($event.target as HTMLInputElement).select()"
            />
            <Button variant="primary" size="small" :disabled="!isFresh" @click="copy">{{
                state === 'copied' ? 'Copied' : 'Copy'
            }}</Button>
        </div>
        <p class="sr-only" aria-live="polite">{{ state === 'copied' ? 'Copied' : '' }}</p>
        <template v-if="!isFresh">
            <p class="text-small text-muted">
                The journal cannot be reached to check this line is still valid, so it cannot be copied now.
            </p>
        </template>
        <template v-if="state === 'refused'">
            <p class="text-small text-danger">
                This browser did not let the journal copy the line. Select the line
                above and copy it with your keyboard.
            </p>
        </template>
        <p class="text-small text-muted">
            Paste it in a terminal in the project folder. It works once, until
            {{ timeOfDay(expiresAt) }}.
        </p>
    </div>
</template>
