<script setup lang="ts">
import { computed } from "vue";
import type { AgentOptionData } from "@generated/types/chat";
import type { RunningCommandData } from "@kit/runningCommands";
import { useRunningCommand } from "../../../composables/useRunningCommand";

/**
 * The strip above the composer, as version 5 drew it: a dot that shows whether the agent holds a command, and the
 * command it runs rolling in as each new one arrives, or the idle word when none shows.
 */
const props = defineProps<{
  agent: AgentOptionData;
  inboxId: string;
  seed: RunningCommandData | null;
}>();

const { line, held } = useRunningCommand(
  () => props.agent.id,
  () => props.inboxId,
  () => props.seed,
);
const idleWord = computed(() =>
  props.agent.status.sessionState === "working" ? "thinking" : "idle",
);
</script>

<template>
  <p
    class="m-0 flex flex-none items-center gap-2 px-3.5 py-1 font-mono text-[12px] text-text-3"
    data-running-strip
  >
    <span
      :class="['size-1.5 flex-none rounded-full', held ? 'bg-accent' : 'bg-text-4']"
      :data-held="held"
      data-running-dot
    />
    <span
      class="pointer-events-none relative flex min-w-0 flex-[0_1_auto] items-center text-[10.5px] text-text-3"
      data-running-command
    >
      <Transition
        mode="out-in"
        enter-active-class="[transition:opacity_180ms_ease,transform_180ms_cubic-bezier(0.22,0.7,0.3,1)] motion-reduce:transition-none"
        leave-active-class="[transition:opacity_150ms_ease,transform_150ms_cubic-bezier(0.22,0.7,0.3,1)] motion-reduce:transition-none"
        enter-from-class="translate-y-[10px] opacity-0"
        leave-to-class="-translate-y-[10px] opacity-0"
      >
        <span
          v-if="line"
          :key="line"
          class="inline-block max-w-full truncate font-mono opacity-75"
          :title="line"
          data-running-line
        >{{ line }}</span>
        <span v-else key="idle" class="inline-block max-w-[44ch] truncate" data-running-idle>{{ idleWord }}</span>
      </Transition>
    </span>
  </p>
</template>
