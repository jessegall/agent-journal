<script setup lang="ts">
import type { RuntimeSetting } from '@/types/generated';

/**
 * A runtime setting as the host observed it, staged it and was asked for it.
 */
defineProps<{ setting: RuntimeSetting }>();
</script>

<template>
    <dd>
        now {{ setting.observed ?? 'unknown' }}, next
        {{ setting.staged ?? 'nothing' }}, asked for
        {{ setting.requested ?? 'nothing' }}
    </dd>
</template>
