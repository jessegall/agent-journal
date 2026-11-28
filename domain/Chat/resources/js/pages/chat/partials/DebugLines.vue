<script setup lang="ts">
import type { AgentLogLineData } from "@generated/types/chat";
import { clockOf } from "../../../agentLogTimes";

/**
 * What happened around the agent in its newest start, as quiet lines in its chat: the time in mono, a dot, the event
 * in plain words and its detail; a failure in red with its reason. Each line opens Technical details at its entry.
 */
defineProps<{ lines: AgentLogLineData[] }>();

const emit = defineEmits<{ open: [lineId: string] }>();
</script>

<template>
  <template v-if="lines.length > 0">
    <ol class="flex flex-col gap-0.5" aria-label="What happened around the agent" data-debug-lines>
      <template v-for="line in lines" :key="line.id">
        <li>
          <button
            type="button"
            class="flex w-full min-w-0 items-baseline gap-1.5 rounded-control px-1 text-left text-meta hover:bg-hover"
            :class="line.isFailure ? 'text-danger' : 'text-text-4'"
            :data-debug-line="line.type"
            :title="`Technical details: ${line.title}`"
            @click="emit('open', line.id)"
          >
            <span class="font-mono">{{ clockOf(line.at) }}</span>
            <span aria-hidden="true">·</span>
            <span class="font-medium" :class="line.isFailure ? 'text-danger' : 'text-text-3'">{{ line.title }}</span>
            <template v-if="line.detail !== ''">
              <span class="min-w-0 truncate">· {{ line.detail }}</span>
            </template>
          </button>
        </li>
      </template>
    </ol>
  </template>
</template>
