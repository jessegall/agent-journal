<script setup lang="ts">
import type { TextAnchor } from '@kit/CoreTypes';

/**
 * The place in the text a comment is about, which opens its source when pressed.
 */
defineProps<{ anchor: TextAnchor }>();

defineEmits<{ open: [] }>();
</script>

<template>
    <button type="button" class="text-small text-left underline" @click="$emit('open')">
        On version {{ anchor.versionLabel }}, lines {{ anchor.firstLine }}–{{ anchor.lastLine }}
    </button>
</template>
