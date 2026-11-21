<script setup lang="ts">
import { dateTimeWithZone, timeAgo } from '@kit/format';
import type { ProjectBindingRowData } from '@generated/types/connections';
import Button from '@kit/Button';
import StateBadge from '@kit/StateBadge';
import { computed } from 'vue';
import { bindingLooks } from './bindingLooks';
import TerminalAccess from './TerminalAccess.vue';

/**
 * One connected folder, in reading order: its project and environment, the device and reference that tell two
 * folders of one name apart, its outlined state with the words for it, and when its relay was last in contact, as a
 * relative time with the absolute date and zone for a reader, then each program with the command that starts it in the
 * folder, or the reason Start is not offered for it. Unless it is revoked already it has a box to choose it
 * for revoking with others and its own Revoke, named for its device, both held back while the list is only last
 * known; what came of a revoke shows under it, and its terminal sign-ins under Terminal access.
 */
const props = defineProps<{
    binding: ProjectBindingRowData;
    isChosen: boolean;
    isStale: boolean;
    outcome?: string;
    serverTime: string;
}>();

const emit = defineEmits<{ revoke: []; choose: [chosen: boolean] }>();

const looks = computed(() => bindingLooks[props.binding.state]);

const shortReference = computed(() => props.binding.id.slice(-6).toUpperCase());

const deviceName = computed(() => `${props.binding.machineLabel} ${shortReference.value}`);
</script>

<template>
    <li
        :id="`binding-${binding.id}`"
        tabindex="-1"
        class="flex items-start gap-3 border-b border-line px-4 py-3 last:border-b-0"
    >
        <template v-if="binding.state !== 'revoked'">
            <input
                type="checkbox"
                class="mt-1"
                :checked="isChosen"
                :disabled="isStale"
                :aria-label="`Choose ${binding.projectLabel} on ${deviceName}`"
                @change="emit('choose', ($event.target as HTMLInputElement).checked)"
            />
        </template>
        <dl class="flex min-w-0 flex-1 flex-col gap-0.5">
            <dt class="sr-only">Project</dt>
            <dd class="truncate font-medium">{{ binding.projectLabel }} / {{ binding.environmentLabel }}</dd>
            <dt class="sr-only">Device</dt>
            <dd class="truncate text-small text-text-2">{{ binding.machineLabel }} · {{ shortReference }}</dd>
            <dt class="sr-only">Status</dt>
            <dd class="flex flex-wrap items-center gap-2">
                <StateBadge :label="looks.label" :tone="looks.tone" outlined />
                <span class="text-small text-muted">{{ binding.stateText }}</span>
            </dd>
            <dt class="sr-only">Last contact</dt>
            <dd class="text-small text-muted">
                <template v-if="binding.lastContactAt === null">Not in contact yet</template>
                <template v-else>
                    Last contact
                    <time :datetime="binding.lastContactAt" :title="dateTimeWithZone(binding.lastContactAt)">
                        {{ timeAgo(binding.lastContactAt, serverTime) }}
                    </time>
                    <span class="sr-only">, {{ dateTimeWithZone(binding.lastContactAt) }}</span>
                </template>
            </dd>
            <dt class="sr-only">Start</dt>
            <dd>
                <ul class="flex flex-col gap-0.5 text-small">
                    <li v-for="provider in binding.capabilities" :key="provider.driver">
                        <template v-if="provider.canStart">
                            <span class="font-medium">{{ provider.label }}</span>: start it with
                            <code>{{ provider.startCommand }}</code> in the folder
                        </template>
                        <template v-else>
                            <span class="font-medium">{{ provider.label }}</span>
                            <span class="text-muted">unavailable: {{ provider.unavailableReason }}</span>
                        </template>
                    </li>
                </ul>
            </dd>
            <template v-if="outcome">
                <dd class="text-small text-text-2" aria-live="polite">{{ outcome }}</dd>
            </template>
            <dt class="sr-only">Terminal access</dt>
            <dd><TerminalAccess :sign-ins="binding.signIns" /></dd>
        </dl>
        <template v-if="binding.state !== 'revoked'">
            <Button
                variant="bordered"
                size="small"
                :aria-label="`Revoke connection for ${deviceName}`"
                :disabled="isStale"
                @click="emit('revoke')"
                >Revoke</Button
            >
        </template>
    </li>
</template>
