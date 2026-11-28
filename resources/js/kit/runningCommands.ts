import type { RunningCommandData } from '@generated/types/core';

// A domain reads the line's type here, as core's generated types are not its own.
export type { RunningCommandData };

/**
 * The signal that an agent's chat line changed: the live connection raises it with the new line, and the chat's line
 * above the composer follows it with no page read.
 */
type RunningCommandListener = (command: RunningCommandData) => void;

const listeners = new Set<RunningCommandListener>();

export function onRunningCommand(listener: RunningCommandListener): () => void {
    listeners.add(listener);

    return () => listeners.delete(listener);
}

export function notifyRunningCommand(command: RunningCommandData): void {
    listeners.forEach((listener) => listener(command));
}
