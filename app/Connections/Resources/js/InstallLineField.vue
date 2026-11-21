<script setup lang="ts">
import Button from '@kit/Button';
import { ref } from 'vue';

/**
 * An issued install line in a read-only field with one Copy action, which copies exactly the bytes shown, and when
 * the line expires.
 */
const props = defineProps<{ line: string; expiresAt: string }>();

const copied = ref(false);

async function copy(): Promise<void> {
    await navigator.clipboard.writeText(props.line);
    copied.value = true;
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
            />
            <Button variant="primary" size="small" @click="copy">{{
                copied ? 'Copied' : 'Copy'
            }}</Button>
        </div>
        <p class="text-small text-muted">
            Paste it in a terminal in the project folder. It works once, until
            {{ new Date(expiresAt).toLocaleTimeString() }}.
        </p>
    </div>
</template>
