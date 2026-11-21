<script setup lang="ts">
import { dateTimeWithZone, timeAgo } from '@kit/format';
import type { ProjectBindingRowData } from '@generated/types/connections';
import Button from '@kit/Button';
import Modal from '@kit/Modal';
import StateBadge from '@kit/StateBadge';
import { computed, nextTick, ref } from 'vue';
import { bindingLooks } from './bindingLooks';
import TerminalAccess from './TerminalAccess.vue';

/**
 * One connected folder, in reading order: its project and environment, the device and reference that tell two
 * folders of one name apart, its outlined state with the words for it, and when its relay was last in contact, as a
 * relative time with the absolute date and zone for a reader, then each program with the command that starts it in the
 * folder, or the reason Start is not offered for it. Unless it is revoked already it has a box to choose it
 * for revoking with others and its own Revoke, named for its device, both held back while the list is only last
 * known. Revoke asks first in a dialog named for the device, with Cancel focused, and Cancel gives focus back to
 * Revoke; a revoke whose answer was lost offers Retry while the folder is still connected. What came of a revoke
 * shows under it, and its terminal sign-ins under Terminal access.
 */
const props = defineProps<{
    binding: ProjectBindingRowData;
    isChosen: boolean;
    isStale: boolean;
    outcome?: string;
    revokeUnconfirmed?: boolean;
    serverTime: string;
}>();

const emit = defineEmits<{
    revoke: [deviceName: string];
    choose: [chosen: boolean];
}>();

const isAsking = ref(false);
const revokeButton = ref<{ $el: HTMLElement } | null>(null);
const cancelButton = ref<{ $el: HTMLElement } | null>(null);

function ask(): void {
    isAsking.value = true;
}

/**
 * Takes the question back and gives focus to the Revoke that asked it.
 */
function takeBack(): void {
    isAsking.value = false;
    void nextTick(() => revokeButton.value?.$el.focus());
}

function confirm(): void {
    isAsking.value = false;
    emit('revoke', deviceName.value);
}

const looks = computed(() => bindingLooks[props.binding.state]);

const shortReference = computed(() => props.binding.id.slice(-6).toUpperCase());

const deviceName = computed(
    () => `${props.binding.machineLabel} ${shortReference.value}`,
);
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
                @change="
                    emit('choose', ($event.target as HTMLInputElement).checked)
                "
            />
        </template>
        <dl class="flex min-w-0 flex-1 flex-col gap-0.5">
            <dt class="sr-only">Project</dt>
            <dd class="truncate font-medium">
                {{ binding.projectLabel }} / {{ binding.environmentLabel }}
            </dd>
            <dt class="sr-only">Device</dt>
            <dd class="truncate text-small text-text-2">
                {{ binding.machineLabel }} · {{ shortReference }}
            </dd>
            <dt class="sr-only">Status</dt>
            <dd class="flex flex-wrap items-center gap-2">
                <StateBadge :label="looks.label" :tone="looks.tone" outlined />
                <span class="text-small text-muted">{{
                    binding.stateText
                }}</span>
            </dd>
            <dt class="sr-only">Last contact</dt>
            <dd class="text-small text-muted">
                <template v-if="binding.lastContactAt === null"
                    >Not in contact yet</template
                >
                <template v-else>
                    Last contact
                    <time
                        :datetime="binding.lastContactAt"
                        :title="dateTimeWithZone(binding.lastContactAt)"
                    >
                        {{ timeAgo(binding.lastContactAt, serverTime) }}
                    </time>
                    <span class="sr-only"
                        >, {{ dateTimeWithZone(binding.lastContactAt) }}</span
                    >
                </template>
            </dd>
            <dt class="sr-only">Start</dt>
            <dd>
                <ul class="flex flex-col gap-0.5 text-small">
                    <li
                        v-for="provider in binding.capabilities"
                        :key="provider.driver"
                    >
                        <template v-if="provider.canStart">
                            {{ provider.label }}: start it with
                            <code>{{ provider.startCommand }}</code> in the
                            folder
                        </template>
                        <template v-else>
                            <span class="text-muted"
                                >{{ provider.label }} unavailable:
                                {{ provider.unavailableReason }}</span
                            >
                        </template>
                    </li>
                </ul>
            </dd>
            <template v-if="binding.revokedAt !== null">
                <dt class="sr-only">Revoked</dt>
                <dd class="text-small text-muted">
                    Revoked on the server
                    <time :datetime="binding.revokedAt">{{
                        dateTimeWithZone(binding.revokedAt)
                    }}</time>
                </dd>
            </template>
            <template v-if="outcome">
                <dd class="text-small text-text-2" aria-live="polite">
                    {{ outcome }}
                </dd>
            </template>
            <template v-if="revokeUnconfirmed && binding.state !== 'revoked'">
                <dd>
                    <Button
                        variant="bordered"
                        size="small"
                        :disabled="isStale"
                        @click="emit('revoke', deviceName)"
                        >Retry revoke</Button
                    >
                </dd>
            </template>
            <dt class="sr-only">Terminal access</dt>
            <dd><TerminalAccess :sign-ins="binding.signIns" /></dd>
            <dt class="sr-only">Support record</dt>
            <dd>
                <details class="text-small text-muted">
                    <summary>
                        Support record of {{ binding.projectLabel }} on
                        {{ binding.machineLabel }}
                    </summary>
                    <ul class="flex flex-col gap-0.5 pt-1">
                        <li
                            v-for="(step, index) in binding.supportRecord"
                            :key="index"
                        >
                            <time :datetime="step.at">{{
                                dateTimeWithZone(step.at)
                            }}</time
                            >: {{ step.action }} by {{ step.actor }}, project
                            {{ step.projectId ?? 'not recorded' }}
                        </li>
                    </ul>
                </details>
            </dd>
        </dl>
        <template v-if="binding.state !== 'revoked'">
            <Button
                ref="revokeButton"
                variant="bordered"
                size="small"
                :aria-label="`Revoke connection for ${deviceName}`"
                :disabled="isStale"
                @click="ask"
                >Revoke</Button
            >
            <Modal
                :is-open="isAsking"
                :title="`Revoke ${deviceName}?`"
                @close="takeBack"
                @opened="cancelButton?.$el.focus()"
            >
                <p class="text-small">
                    Commands and sessions of {{ binding.projectLabel }} on
                    {{ binding.machineLabel }} stop being accepted at once. The
                    files on that computer stay as they are. A device that is
                    offline now stops when its lease ends.
                </p>
                <template #footer>
                    <Button
                        ref="cancelButton"
                        variant="bordered"
                        @click="takeBack"
                        >Cancel</Button
                    >
                    <Button variant="danger" @click="confirm"
                        >Revoke connection</Button
                    >
                </template>
            </Modal>
        </template>
    </li>
</template>
