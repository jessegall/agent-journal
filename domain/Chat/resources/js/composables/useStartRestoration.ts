import {
  forgetStored,
  keepStoredJson,
  readStoredJson,
} from "@kit/browserStorage";
import type { DriverType } from "@kit/CoreTypes";

/**
 * What an open session dialog keeps for this tab, so a reload shows the same choices and the same start: the
 * choices, the field that had the focus and, once submitted, the request id. It holds no secret, no sign-in code, no
 * token and no host screen text.
 */
export type StartRestoration = {
  driver: string;
  driverType: DriverType | "";
  model: string | null;
  accountId: string | null;
  conversationId: string | null;
  saveDriverType: boolean;
  focus: string | null;
  requestId: string | null;
};

const driverTypes = ["", "terminal", "headless"];

function textOrNull(value: unknown): string | null {
  return typeof value === "string" ? value : null;
}

function parse(decoded: unknown): StartRestoration | null {
  if (typeof decoded !== "object" || decoded === null) {
    return null;
  }

  const kept = decoded as Record<string, unknown>;

  if (
    typeof kept.driver !== "string" ||
    !driverTypes.includes(String(kept.driverType))
  ) {
    return null;
  }

  return {
    driver: kept.driver,
    driverType: kept.driverType as DriverType | "",
    model: textOrNull(kept.model),
    accountId: textOrNull(kept.accountId),
    conversationId: textOrNull(kept.conversationId),
    saveDriverType: kept.saveDriverType === true,
    focus: textOrNull(kept.focus),
    requestId: textOrNull(kept.requestId),
  };
}

/**
 * The tab's record of one viewer's dialog for one agent and mode; another viewer's record is never read.
 */
export function useStartRestoration(
  viewerId: string,
  agentId: string,
  mode: string,
) {
  const key = `journal.session-dialog.${viewerId}.${agentId}.${mode}`;

  return {
    read: () => readStoredJson("session", key, parse),
    keep: (restoration: StartRestoration) =>
      keepStoredJson("session", key, restoration),
    forget: () => forgetStored("session", key),
  };
}
