<script setup lang="ts">
import { computed } from 'vue';
import type { TextAnchor } from '@kit/CoreTypes';

/**
 * The place in the text a comment is about. A comment left on an older version says so and opens that version.
 */
const props = defineProps<{ anchor: TextAnchor; currentVersion?: string }>();

defineEmits<{ open: [] }>();

const isOlder = computed(() => props.currentVersion !== undefined && props.anchor.versionId !== props.currentVersion);
</script>

<template>
    <button type="button" class="text-small text-left underline" @click="$emit('open')">
        On {{ anchor.versionLabel }}, lines {{ anchor.firstLine }}–{{ anchor.lastLine }}
        <template v-if="isOlder"> (an older version): open original location</template>
    </button>
</template>
