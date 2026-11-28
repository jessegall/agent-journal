import type { SessionActivityStatus } from "@kit/CoreTypes";
import type { StatusState } from "@kit/Status";

/**
 * Each session state as the kit's Status shows it: a spinner while it moves, a hollow dot at rest, an alert when
 * refused. The agent bar and the chat list draw the same mark for the same state.
 */
export const sessionLooks: Record<SessionActivityStatus, StatusState> = {
  stopped: "stopped",
  starting: "connecting",
  working: "working",
  idle: "open",
  stopping: "running",
  interrupting: "running",
  failed: "failed",
  refused: "failed",
  "waiting-for-sign-in": "not-signed-in",
  unknown: "open",
  retired: "ended",
  verifying: "connecting",
  unverified: "open",
};
