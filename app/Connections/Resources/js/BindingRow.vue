<script setup lang="ts">
import type { ProjectBindingRowData } from '@generated/types/connections';
import Button from '@kit/Button';
import StateBadge from '@kit/StateBadge';
import { computed } from 'vue';
import { bindingLooks } from './bindingLooks';

/**
 * One connected folder: its machine and project, when it was last in contact, its state and, unless it is revoked
 * already, a Revoke action.
 */
const props = defineProps<{ binding: ProjectBindingRowData }>();

const emit = defineEmits<{ revoke: [] }>();

const looks = computed(() => bindingLooks[props.binding.state]);

const lastContact = computed(() =>
    props.binding.lastContactAt === null
        ? 'Not in contact yet'
        : `Last contact ${new Date(props.binding.lastContactAt).toLocaleString()}`,
);
</script>

<template>
    <li class="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0">
        <div class="min-w-0 flex-1">
            <div class="truncate font-medium">
                {{ binding.projectLabel }} on {{ binding.machineLabel }}
            </div>
            <div class="text-small text-muted">{{ lastContact }}</div>
        </div>
        <StateBadge :label="looks.label" :tone="looks.tone" />
        <template v-if="binding.state !== 'revoked'">
            <Button variant="bordered" size="small" @click="emit('revoke')"
                >Revoke</Button
            >
        </template>
    </li>
</template>
