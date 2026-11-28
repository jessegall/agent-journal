import type { SessionActivityStatus } from "@kit/CoreTypes";
import type { StatusState } from "@kit/Status";

/**
 * Each session state as the kit's Status shows it: a spinner only while the agent starts, works or is verified, a hollow
 * dot otherwise, unknown with its own word, an alert when refused. The tabs, the agent row and the chat list draw the
 * same mark for the same state.
 */
export const sessionLooks: Record<SessionActivityStatus, StatusState> = {
  stopped: "stopped",
  starting: "connecting",
  working: "working",
  idle: "open",
  stopping: "stopped",
  interrupting: "interrupted",
  failed: "failed",
  refused: "failed",
  "waiting-for-sign-in": "not-signed-in",
  unknown: "unknown",
  retired: "ended",
  verifying: "connecting",
  unverified: "open",
};
