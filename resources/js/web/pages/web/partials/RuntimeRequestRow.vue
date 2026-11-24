<script setup lang="ts">
import Button from '@kit/Button';
import type { DriverRequestStatus } from '@/types/generated';
import { router } from '@inertiajs/vue3';
import { recover } from '../../../runtimeRecovery';

/**
 * One driver request of a runtime: its place, operation, progress, expected timing and the key script it runs, with
 * the recoveries the owner may run on it now.
 */
const props = defineProps<{ request: DriverRequestStatus }>();

function run(
    action: string,
    question: string,
    extra: Record<string, unknown> = {},
): void {
    const body = { rowVersion: props.request.rowVersion, ...extra };

    recover(`requests/${props.request.requestId}/${action}`, body, question);
}
</script>

<template>
    <tr>
        <td class="font-mono">{{ request.sequence }}</td>
        <td>{{ request.operation }}</td>
        <td>
            {{ request.progress
            }}{{ request.outcome ? ` (${request.outcome})` : '' }}
        </td>
        <td>{{ request.expectedTiming }}</td>
        <td>
            <template v-if="request.script">
                {{ request.script }} step {{ request.scriptStep ?? 0 }}:
                {{ request.scriptEvidence ?? '' }}
            </template>
        </td>
        <td class="flex gap-2">
            <template v-if="request.canRetry">
                <Button
                    variant="bordered"
                    @click="run('retry', 'Why send this request again?')"
                >
                    Retry
                </Button>
            </template>
            <template v-if="request.canCancel">
                <Button
                    variant="bordered"
                    @click="run('cancel', 'Why cancel this request?')"
                >
                    Cancel
                </Button>
            </template>
            <template v-if="request.canResolve">
                <Button
                    variant="bordered"
                    @click="
                        run(
                            'resolve',
                            'What evidence shows the delivery arrived?',
                            { applied: true },
                        )
                    "
                >
                    It arrived
                </Button>
                <Button
                    variant="bordered"
                    @click="
                        run(
                            'resolve',
                            'What evidence shows the delivery never arrived?',
                            { applied: false },
                        )
                    "
                >
                    It never arrived
                </Button>
            </template>
            <template v-if="request.canSendAgain">
                <Button variant="bordered" @click="router.reload()">Check status</Button>
                <Button
                    variant="bordered"
                    @click="
                        run(
                            'send-again',
                            'This delivery may already have arrived, so sending it again may deliver it twice. Why send it again?',
                            { confirmsPossibleDuplicate: true },
                        )
                    "
                >
                    Send again
                </Button>
            </template>
            <template v-if="request.canResumeScript">
                <Button
                    variant="bordered"
                    @click="run('resume-script', 'Why resume this key script?')"
                >
                    Resume
                </Button>
            </template>
            <template v-if="request.canCancelScript">
                <Button
                    variant="bordered"
                    @click="run('cancel-script', 'Why cancel this key script?')"
                >
                    Cancel script
                </Button>
            </template>
        </td>
    </tr>
</template>
