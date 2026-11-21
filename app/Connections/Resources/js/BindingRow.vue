<script setup lang="ts">
import type { ProjectBindingRowData } from '@generated/types/connections';
import Button from '@kit/Button';
import StateBadge from '@kit/StateBadge';
import { computed } from 'vue';
import { bindingLooks } from './bindingLooks';

/**
 * One connected folder: its machine and project, when it was last in contact, its state and, unless it is revoked
 * already, a box to choose it for revoking with others and its own Revoke action; what came of a revoke shows under it.
 */
const props = defineProps<{ binding: ProjectBindingRowData; isChosen: boolean; outcome?: string }>();

const emit = defineEmits<{ revoke: []; choose: [chosen: boolean] }>();

const looks = computed(() => bindingLooks[props.binding.state]);

const lastContact = computed(() =>
    props.binding.lastContactAt === null
        ? 'Not in contact yet'
        : `Last contact ${new Date(props.binding.lastContactAt).toLocaleString()}`,
);
</script>

<template>
    <li :id="`binding-${binding.id}`" class="flex items-center gap-3 border-b border-line px-4 py-3 last:border-b-0">
        <template v-if="binding.state !== 'revoked'">
            <input
                type="checkbox"
                :checked="isChosen"
                :aria-label="`Choose ${binding.projectLabel} on ${binding.machineLabel}`"
                @change="emit('choose', ($event.target as HTMLInputElement).checked)"
            />
        </template>
        <div class="min-w-0 flex-1">
            <div class="truncate font-medium">
                {{ binding.projectLabel }} on {{ binding.machineLabel }}
            </div>
            <div class="text-small text-muted">{{ lastContact }}</div>
            <template v-if="outcome">
                <div class="text-small text-text-2" aria-live="polite">{{ outcome }}</div>
            </template>
        </div>
        <StateBadge :label="looks.label" :tone="looks.tone" />
        <template v-if="binding.state !== 'revoked'">
            <Button variant="bordered" size="small" @click="emit('revoke')"
                >Revoke</Button
            >
        </template>
    </li>
</template>
