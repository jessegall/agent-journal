<script setup lang="ts">
import { computed } from 'vue';
import DriverIcon from './DriverIcon.vue';
import Icon from './Icon.vue';

/**
 * The mark of an agent's driver, as the design draws it: the product's own icon, Claude's for Claude Code and
 * OpenAI's for Codex, whether the driver is named by its family (claude-code) or its short name (claude); any other
 * driver the users icon. It is 11 px inside a small avatar and 16 px in rows and a large avatar.
 */
const props = withDefaults(defineProps<{ driver: string; size?: 11 | 16 }>(), { size: 16 });

const product = computed(() => (['claude', 'codex'] as const).find((name) => props.driver.startsWith(name)));
</script>

<template>
    <template v-if="product !== undefined">
        <DriverIcon :driver="product" :size="size === 11 ? 12 : 16" class="text-text" />
    </template>
    <template v-else>
        <Icon name="users" :size="size" class="text-text-3" />
    </template>
</template>
