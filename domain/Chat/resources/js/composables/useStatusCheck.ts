import type { AgentStatusData } from "@generated/types/chat";

// How long Check status waits for the host's answer, and how often it reads the page meanwhile.
export const CHECK_WAIT_MILLISECONDS = 20_000;
export const CHECK_READ_MILLISECONDS = 4_000;

/**
 * Follows a Check status until the host answered, which is a report newer than the ask, or until the wait ran out;
 * it then ends with nothing to say, or with why it ended without an answer.
 */
export function useStatusCheck(
  status: () => AgentStatusData,
  readPage: (done: () => void) => void,
) {
  function hasAnswered(askedAt: number): boolean {
    const age = status().observationAgeSeconds;

    return age !== null && age * 1000 <= Date.now() - askedAt;
  }

  function silence(): string {
    const age = status().observationAgeSeconds;

    return age === null
      ? "The host did not answer and has not reported on this session yet."
      : `The host did not answer. Its last report was ${age} seconds ago.`;
  }

  function follow(askedAt: number, end: (silence: string | null) => void): void {
    if (hasAnswered(askedAt)) {
      end(null);

      return;
    }

    if (Date.now() - askedAt >= CHECK_WAIT_MILLISECONDS) {
      end(silence());

      return;
    }

    setTimeout(() => readPage(() => follow(askedAt, end)), CHECK_READ_MILLISECONDS);
  }

  return { follow };
}
