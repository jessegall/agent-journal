<script setup lang="ts">
import { clock } from '@/kit/format';
import Button from './Button.vue';
import Icon from './Icon.vue';
import Status from './Status.vue';
import Tooltip from './Tooltip.vue';

/**
 * The head of a ProcessCard: the term Icon 14, the command (mono, ellipsis, its full text in a Tooltip), the Status,
 * the duration as m:ss in tabular numbers, a Stop button while it runs and a button that shows or hides the output
 * (aria-expanded, aria-controls). Padding 7 8 7 12, gap 8.
 */
defineProps<{
    command: string;
    state: 'waiting-to-start' | 'running' | 'passed' | 'failed' | 'stopped';
    durationSeconds: number;
    expanded: boolean;
    outputId: string;
}>();

defineEmits<{ stop: []; toggle: [] }>();
</script>

<template>
    <div class="flex items-center gap-2 py-1.75 pr-2 pl-3">
        <Icon name="term" :size="14" class="shrink-0 text-text-3" />
        <Tooltip :text="command" class="min-w-0 flex-1">
            <template #default="{ describedBy }">
                <span :aria-describedby="describedBy" class="min-w-0 truncate font-mono text-field text-text">{{ command }}</span>
            </template>
        </Tooltip>
        <Status :state="state" live />
        <span class="shrink-0 text-small text-text-3 tabular-nums">{{ clock(durationSeconds) }}</span>
        <Button v-if="state === 'running'" variant="bordered" size="sm" @click="$emit('stop')">Stop</Button>
        <Button
            variant="bordered"
            size="sm"
            :aria-expanded="expanded"
            :aria-controls="outputId"
            @click="$emit('toggle')"
        >
            {{ expanded ? 'Hide output' : 'Show output' }}
        </Button>
    </div>
</template>
