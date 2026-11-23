<script setup lang="ts">
import Icon from "@kit/Icon";

/**
 * What a plain line in the chat says: the sequence mark, what it is about in bold, then what happened.
 */
defineProps<{ subject: string; words: string }>();
</script>

<template>
  <Icon name="sequence" :size="14" />
  <span
    ><b class="font-medium text-text-2">{{ subject }}</b> · {{ words }}</span
  >
</template>
