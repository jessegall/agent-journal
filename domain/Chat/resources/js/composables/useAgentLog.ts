import { chatAgentLog, load, LoaderCancelled } from "@kit/loaders";
import { computed, ref } from "vue";
import type { AgentLogData, AgentLogLineData } from "@generated/types/chat";

/**
 * Which lines the panel shows: every line, or only the failures.
 */
export type AgentLogFilter = "everything" | "failures";

/**
 * An agent's technical log, read only when the panel opens, by the loader that names it alone: its starts newest
 * first, filtered to the failures on request.
 */
export function useAgentLog(agentId: () => string) {
  const log = ref<AgentLogData | null>(null);
  const failure = ref<string | null>(null);
  const filter = ref<AgentLogFilter>("everything");

  const failureCount = computed(
    () => log.value?.starts.flatMap((start) => start.lines).filter((line) => line.isFailure).length ?? 0,
  );
  const starts = computed(() =>
    (log.value?.starts ?? []).map((start) => ({
      ...start,
      lines: start.lines.filter((line: AgentLogLineData) => filter.value === "everything" || line.isFailure),
    })),
  );

  function read(): void {
    failure.value = null;
    load(chatAgentLog, { agent: agentId() }).then(
      (answer) => {
        if (answer.status !== "ok") {
          failure.value = "The technical details could not be read.";

          return;
        }

        log.value = answer.value;
      },
      (error: Error) => {
        if (!(error instanceof LoaderCancelled)) {
          failure.value = "The technical details could not be read.";
        }
      },
    );
  }

  return { log, failure, filter, failureCount, starts, read };
}
