<script setup lang="ts">
import type { RuntimeSetting } from '@/types/generated';

/**
 * A runtime setting as the host observed it, staged it and was asked for it.
 */
defineProps<{ setting: RuntimeSetting }>();
</script>

<template>
    <dd>
        observed {{ setting.observed ?? 'unknown' }}, staged
        {{ setting.staged ?? 'none' }}, requested
        {{ setting.requested ?? 'none' }}
    </dd>
</template>
