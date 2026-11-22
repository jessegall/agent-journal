<script setup lang="ts">
import { ref, useId } from 'vue';
import Card from './Card.vue';
import ProcessHeader from './ProcessHeader.vue';
import ProcessOutput from './ProcessOutput.vue';

/**
 * A command run shown in the chat: a raised Card at most 92% wide, a group named "Command <command>", with its
 * ProcessHeader and its ProcessOutput. Show output opens the whole log; Stop is emitted while it runs.
 */
defineProps<{
    command: string;
    state: 'waiting-to-start' | 'running' | 'passed' | 'failed' | 'stopped';
    durationSeconds: number;
    lines: string[];
}>();

defineEmits<{ stop: [] }>();

const expanded = ref(false);
const outputId = useId();
</script>

<template>
    <Card role="group" :aria-label="`Command ${command}`" class="max-w-[92%] overflow-hidden p-0!">
        <ProcessHeader
            :command="command"
            :state="state"
            :duration-seconds="durationSeconds"
            :expanded="expanded"
            :output-id="outputId"
            @stop="$emit('stop')"
            @toggle="expanded = !expanded"
        />
        <ProcessOutput :id="outputId" :lines="lines" :state="state" :expanded="expanded" />
    </Card>
</template>
