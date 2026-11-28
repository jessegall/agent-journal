<script setup lang="ts">
import ChipButton from "@kit/ChipButton";
import Button from "@kit/Button";
import IconButton from "@kit/IconButton";
import RowSkeleton from "@kit/RowSkeleton";
import { nextTick, onMounted, ref } from "vue";
import type { AgentLogLineData } from "@generated/types/chat";
import { secondsClockOf } from "../../../agentLogTimes";
import { useAgentLog } from "../../../composables/useAgentLog";

/**
 * Technical details, inside the chat: the agent's starts newest first, each with its outcome and its lines to the
 * second, Everything or only the Failures; a failure opens to its reason and its evidence, which can be copied. It
 * reads its log only once opened. The arrow keys move between failures and Escape closes it.
 */
const props = defineProps<{ agentId: string; agentName: string; openedAt: string | null }>();

const emit = defineEmits<{ close: [] }>();

const log = useAgentLog(() => props.agentId);
const expanded = ref<string | null>(props.openedAt);
const panel = ref<HTMLElement | null>(null);

function evidenceOf(line: AgentLogLineData): string {
  return [`${line.title} at ${line.at}`, `Reason: ${line.reason ?? ""}`, `Evidence: ${line.evidence ?? ""}`].join("\n");
}

function copy(text: string): void {
  void navigator.clipboard?.writeText(text);
}

function copyAll(): void {
  copy(
    log.starts.value
      .flatMap((start) => [`Start ${start.sessionId} · ${start.outcome}`, ...start.lines.map(evidenceOf)])
      .join("\n\n"),
  );
}

function press(event: KeyboardEvent): void {
  if (event.key === "Escape") {
    event.preventDefault();
    emit("close");

    return;
  }

  const step = { ArrowDown: 1, ArrowUp: -1 }[event.key];
  const failures = [...(panel.value?.querySelectorAll<HTMLElement>("[data-log-failure]") ?? [])];

  if (step === undefined || failures.length === 0) {
    return;
  }

  event.preventDefault();
  const at = failures.indexOf(document.activeElement as HTMLElement);
  failures[(at + step + failures.length) % failures.length]?.focus();
}

onMounted(async () => {
  log.read();
  await nextTick();
  panel.value?.focus();
});
</script>

<template>
  <aside
    ref="panel"
    tabindex="-1"
    class="absolute top-3 right-3 z-20 flex max-h-[calc(100%-24px)] w-[420px] flex-col overflow-hidden rounded-card border border-border-2 bg-raised shadow-lg outline-none max-[760px]:static max-[760px]:w-full"
    aria-label="Technical details"
    data-agent-log
    @keydown="press"
  >
    <header class="flex items-center gap-2 border-b border-border px-3 py-2.5 text-body text-text">
      <b class="min-w-0 flex-1 truncate font-medium">Technical details · {{ agentName }} · newest first</b>
      <IconButton icon="close" label="Close Technical details" size="sm" @click="emit('close')" />
    </header>
    <div class="flex gap-1 border-b border-line px-3 py-2" role="group" aria-label="Show">
      <ChipButton shape="pill" :pressed="log.filter.value === 'everything'" data-log-filter="everything" @click="log.filter.value = 'everything'"
        >Everything</ChipButton
      >
      <ChipButton
        shape="pill"
        :pressed="log.filter.value === 'failures'"
        :count="log.failureCount.value > 0 ? log.failureCount.value : undefined"
        data-log-filter="failures"
        @click="log.filter.value = 'failures'"
        >Failures</ChipButton
      >
    </div>
    <div class="overflow-y-auto px-3 py-2">
      <template v-if="log.failure.value">
        <p class="text-small text-danger" role="alert">{{ log.failure.value }}</p>
      </template>
      <template v-else-if="log.log.value === null">
        <RowSkeleton label="Loading the technical details" />
      </template>
      <template v-else-if="log.starts.value.length === 0">
        <p class="text-small text-text-3" data-log-empty>No start yet.</p>
      </template>
      <template v-for="start in log.starts.value" :key="start.sessionId">
        <section class="mb-3" :data-log-start="start.sessionId">
          <h3 class="mb-1 text-small font-medium" :class="start.hasFailed ? 'text-danger' : 'text-text-2'">
            {{ start.outcome }} · {{ secondsClockOf(start.startedAt) }}
          </h3>
          <ol class="flex flex-col gap-0.5">
            <template v-for="line in start.lines" :key="line.id">
              <li>
                <template v-if="line.isFailure">
                  <Button
                    variant="bare"
                    type="button"
                    class="flex w-full items-baseline gap-1.5 rounded-control px-1 text-left text-meta text-danger hover:bg-hover focus-visible:outline-2 focus-visible:outline-focus"
                    :aria-expanded="expanded === line.id"
                    data-log-failure
                    :data-log-line="line.id"
                    @click="expanded = expanded === line.id ? null : line.id"
                  >
                    <span class="font-mono">{{ secondsClockOf(line.at) }}</span>
                    <span class="font-medium">{{ line.title }}</span>
                    <span class="min-w-0 truncate">· {{ line.detail }}</span>
                  </Button>
                  <template v-if="expanded === line.id">
                    <dl class="mt-1 mb-2 ml-1 flex flex-col gap-1 text-meta" data-log-evidence>
                      <dt class="text-text-4">Reason</dt>
                      <dd class="text-text-2">{{ line.reason }}</dd>
                      <dt class="text-text-4">Evidence</dt>
                      <dd class="font-mono break-all text-text-3">{{ line.evidence }}</dd>
                      <dd>
                        <Button size="small" variant="bordered" data-copy-evidence @click="copy(evidenceOf(line))"
                          >Copy the evidence</Button
                        >
                      </dd>
                    </dl>
                  </template>
                </template>
                <template v-else>
                  <span class="flex items-baseline gap-1.5 px-1 text-meta text-text-4" :data-log-line="line.id">
                    <span class="font-mono">{{ secondsClockOf(line.at) }}</span>
                    <span class="text-text-3">{{ line.title }}</span>
                    <span class="min-w-0 truncate">· {{ line.detail }}</span>
                  </span>
                </template>
              </li>
            </template>
          </ol>
        </section>
      </template>
    </div>
    <footer class="flex justify-end border-t border-line px-3 py-2">
      <Button size="small" variant="bordered" :disabled="log.log.value === null" data-copy-all @click="copyAll"
        >Copy all</Button
      >
    </footer>
  </aside>
</template>
