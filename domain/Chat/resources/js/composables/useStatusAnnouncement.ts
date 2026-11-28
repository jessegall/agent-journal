import { ref, watch } from "vue";
import type { AgentStatusData } from "@generated/types/chat";

/**
 * The bar's words for screen readers: each change of the agent's status is announced once per operation and version,
 * politely, and a failure that asks for an action once as an alert; while the session dialog is open the dialog
 * announces instead.
 */
export function useStatusAnnouncement(
  status: () => AgentStatusData | undefined,
  isDialogOpen: () => boolean,
) {
  const polite = ref("");
  const alert = ref("");
  let lastAnnounced = "";

  const actionable = new Set([
    "failed",
    "refused",
    "waiting-for-sign-in",
  ]);

  watch(
    status,
    (shown) => {
      if (shown === undefined || isDialogOpen()) {
        return;
      }

      const operation = shown.operation;
      const key = [
        shown.sessionState,
        shown.label,
        operation?.id ?? "",
        operation?.version ?? "",
      ].join("|");

      if (key === lastAnnounced) {
        return;
      }

      lastAnnounced = key;
      const words =
        shown.reason === null ? shown.label : `${shown.label}. ${shown.reason}`;

      if (actionable.has(shown.sessionState)) {
        alert.value = words;
        polite.value = "";

        return;
      }

      polite.value = words;
      alert.value = "";
    },
    { immediate: true },
  );

  return { polite, alert };
}
