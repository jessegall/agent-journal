<script setup lang="ts">
import { useTemplateRef } from 'vue';
import Button from './Button.vue';
import Icon from './Icon.vue';
import type { IconName } from './Icon.vue';

/**
 * A button that opens the browser's file chooser and hands on the one file chosen; choosing the same file again hands
 * it on again. accept names the file types offered, and label names the chooser for a screen reader.
 */
defineProps<{ label: string; accept: string; icon?: IconName }>();

const emit = defineEmits<{ chosen: [file: File] }>();
const input = useTemplateRef<HTMLInputElement>('input');

function handOn(): void {
    const file = input.value?.files?.[0];

    if (file !== undefined) {
        emit('chosen', file);
    }

    if (input.value !== null) {
        input.value.value = '';
    }
}
</script>

<template>
    <Button @click="input?.click()"
        ><template v-if="icon"><Icon :name="icon" :size="12" /></template><slot
    /></Button>
    <input ref="input" type="file" :accept="accept" class="hidden" :aria-label="label" @change="handOn" />
</template>
