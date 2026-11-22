<script setup lang="ts">
import { computed } from 'vue';
import Icon from './Icon.vue';

/**
 * The mark of an agent's driver: Claude is a spark in the Claude colour, Codex a knot in the text colour, any other
 * driver the users icon. It is 11 px inside a small avatar and 16 px in rows and a large avatar.
 */
const props = withDefaults(defineProps<{ driver: string; size?: 11 | 16 }>(), { size: 16 });

const shape = computed(() => ({ claude: 'spark', codex: 'knot' })[props.driver] ?? 'users');
const colour = computed(() => ({ claude: 'text-mark-claude', codex: 'text-text' })[props.driver] ?? 'text-text-3');
</script>

<template>
    <Icon :name="shape as 'spark' | 'knot' | 'users'" :size="size" :class="colour" />
</template>
