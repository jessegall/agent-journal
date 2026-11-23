<script setup lang="ts">
import Button from "@kit/Button";
import Icon from "@kit/Icon";
import type { IconName } from "@kit/Icon";

/**
 * One of a message's hover controls, such as React or Reply: an icon and a word with no border and no fill, as the
 * design draws them on the message's name line.
 */
defineProps<{ icon?: IconName; label?: string }>();
</script>

<template>
  <Button variant="word" :aria-label="label">
    <template v-if="icon !== undefined" #icon>
      <Icon :name="icon" :size="14" />
    </template>
    <slot />
  </Button>
</template>
