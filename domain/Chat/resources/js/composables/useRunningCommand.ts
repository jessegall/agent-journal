import { onRunningCommand, type RunningCommandData } from "@kit/runningCommands";
import { computed, onScopeDispose, ref, toValue, watch } from "vue";
import type { ComputedRef, MaybeRefOrGetter, Ref } from "vue";

/**
 * The shortest time between two changes of the line, so a burst of commands shows its newest twice a second at most.
 */
export const RUNNING_COMMAND_GAP_MS = 500;

/**
 * How long a finished command stays on the line before the idle word takes its place.
 */
export const COMMAND_LINGER_MS = 5000;

export type RunningCommandLine = {
  /** The command the line names, or null while the idle word shows. */
  line: Ref<string | null>;
  /** Whether the agent holds a command, lingering included: the dot shows it. */
  held: ComputedRef<boolean>;
};

/**
 * The line above the composer for the chosen agent of one chat: seeded by the page read, moved by each change the
 * live connection pushes, newest first, at most one change per gap, and a finished command lingering before it goes.
 */
export function useRunningCommand(
  agentId: MaybeRefOrGetter<string>,
  inboxId: MaybeRefOrGetter<string>,
  seed: MaybeRefOrGetter<RunningCommandData | null>,
): RunningCommandLine {
  const shown = ref<RunningCommandData | null>(null);
  const line = ref<string | null>(null);
  let newestApplied: string | null = null;
  let waiting: RunningCommandData | null = null;
  let lastShownAt = Number.NEGATIVE_INFINITY;
  let gapTimer: ReturnType<typeof setTimeout> | undefined;
  let lingerTimer: ReturnType<typeof setTimeout> | undefined;

  function stopTimers(): void {
    clearTimeout(gapTimer);
    clearTimeout(lingerTimer);
    gapTimer = undefined;
    lingerTimer = undefined;
  }

  function show(command: RunningCommandData): void {
    clearTimeout(lingerTimer);
    lingerTimer = undefined;
    shown.value = command;
    lastShownAt = Date.now();

    if (command.line === null || command.isRunning) {
      line.value = command.line;

      return;
    }

    const lingerLeft = Date.parse(command.changedAt) + COMMAND_LINGER_MS - Date.now();

    if (lingerLeft <= 0) {
      line.value = null;

      return;
    }

    line.value = command.line;
    lingerTimer = setTimeout(() => {
      line.value = null;
    }, lingerLeft);
  }

  function showWaiting(): void {
    gapTimer = undefined;

    if (waiting !== null) {
      const next = waiting;
      waiting = null;
      show(next);
    }
  }

  function accept(command: RunningCommandData): void {
    if (command.agentId !== toValue(agentId)) {
      return;
    }

    // Times share one fixed format, so text order is time order; an equal time was applied already.
    if (newestApplied !== null && command.changedAt <= newestApplied) {
      return;
    }

    newestApplied = command.changedAt;
    const sinceShown = Date.now() - lastShownAt;

    if (command.line === null || sinceShown >= RUNNING_COMMAND_GAP_MS) {
      clearTimeout(gapTimer);
      gapTimer = undefined;
      waiting = null;
      show(command);

      return;
    }

    waiting = command;
    gapTimer ??= setTimeout(showWaiting, RUNNING_COMMAND_GAP_MS - sinceShown);
  }

  function reset(): void {
    stopTimers();
    newestApplied = null;
    waiting = null;
    lastShownAt = Number.NEGATIVE_INFINITY;
    shown.value = null;
    line.value = null;
    const seeded = toValue(seed);

    if (seeded !== null) {
      accept(seeded);
    }
  }

  watch(() => [toValue(agentId), toValue(inboxId)], reset, { immediate: true });
  watch(
    () => toValue(seed),
    (seeded) => {
      if (seeded !== null) {
        accept(seeded);
      }
    },
  );
  const stopListening = onRunningCommand(accept);

  onScopeDispose(() => {
    stopListening();
    stopTimers();
  });

  return { line, held: computed(() => shown.value !== null && shown.value.line !== null) };
}
