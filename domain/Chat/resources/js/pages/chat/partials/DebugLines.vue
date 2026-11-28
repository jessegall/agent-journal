<script setup lang="ts">
import Button from "@kit/Button";
import { computed, ref } from "vue";
import type { AgentLogLineData } from "@generated/types/chat";
import { clockOf } from "../../../agentLogTimes";

/**
 * What happened around the agent in its newest start, folded into one small icon in its chat, red when a step failed;
 * a click unfolds the quiet lines: the time in mono, a dot, the event in plain words and its detail. Each line opens
 * Technical details at its entry.
 */
const props = defineProps<{ lines: AgentLogLineData[] }>();

const emit = defineEmits<{ open: [lineId: string] }>();

const isUnfolded = ref(false);
const hasFailure = computed(() => props.lines.some((line) => line.isFailure));
</script>

<template>
  <template v-if="lines.length > 0">
    <div class="flex flex-col items-start gap-0.5" data-debug-lines>
      <Button
        variant="bare"
        type="button"
        class="flex items-center gap-1 rounded-control px-1 text-meta hover:bg-hover"
        :class="hasFailure ? 'text-danger' : 'text-text-4'"
        :aria-expanded="isUnfolded"
        :aria-label="isUnfolded ? 'Hide what happened around the agent' : 'Show what happened around the agent'"
        :title="isUnfolded ? 'Hide what happened around the agent' : 'Show what happened around the agent'"
        data-debug-toggle
        @click="isUnfolded = !isUnfolded"
      >
        <svg width="13" height="13" viewBox="0 0 14 14" fill="none" stroke="currentColor" aria-hidden="true">
          <path d="M1 7.5h2.5L5 3.5l2.5 7L9 6l1 1.5h3" />
        </svg>
        <span>{{ lines.length }}</span>
      </Button>
      <template v-if="isUnfolded">
        <ol class="flex w-full flex-col gap-0.5" aria-label="What happened around the agent">
          <template v-for="line in lines" :key="line.id">
            <li>
              <Button
                variant="bare"
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
              </Button>
            </li>
          </template>
        </ol>
      </template>
    </div>
  </template>
</template>
