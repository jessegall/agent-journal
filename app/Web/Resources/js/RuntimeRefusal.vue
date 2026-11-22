<script setup lang="ts">
import { usePage } from '@inertiajs/vue3';
import type { RecoveryRefusalPartData } from '@/types/generated';
import { computed } from 'vue';

/**
 * A refused recovery as a native part of the runtime status, shown above the runtimes once the redirect brings it
 * back as the page's error.
 */
const props = defineProps<RecoveryRefusalPartData>();

const page = usePage<{ errors: Record<string, string> }>();
const refusal = computed(() => page.props.errors[props.errorKey] ?? '');
</script>

<template>
    <template v-if="refusal !== ''">
        <p role="alert" class="text-warn">{{ refusal }}</p>
    </template>
</template>
