import { reactive, watch } from "vue";
import { keepStoredJson, readStoredJson } from "@kit/browserStorage";

/**
 * The chats one user keeps open on Home: the tabs in their order, the same chats the most recently used first, and
 * how many of them show side by side as columns. Only the tabs are kept across reloads: Home always opens one chat.
 */
export type OpenChats = { agentIds: string[]; recent: string[]; columns: number };

type KeptChats = Pick<OpenChats, "agentIds" | "recent">;

/**
 * The most chats Home shows side by side: the chosen one and three beside it.
 */
export const MOST_COLUMNS = 4;

const stores = new Map<string, OpenChats>();

function readKept(key: string): OpenChats {
  const kept = readStoredJson<KeptChats>("local", key, (decoded) => {
    const read = decoded as Partial<KeptChats> | null;

    if (!Array.isArray(read?.agentIds)) {
      return null;
    }

    const agentIds = read.agentIds.filter((id) => typeof id === "string");
    const recent = (Array.isArray(read.recent) ? read.recent : []).filter((id) => agentIds.includes(id));

    return { agentIds, recent: [...recent, ...agentIds.filter((id) => !recent.includes(id))] };
  }) ?? { agentIds: [], recent: [] };

  // Side by side lasts only while the user keeps it on this page: a load of Home shows one chat.
  return { ...kept, columns: 1 };
}

/**
 * The open chats of one user, their tabs kept in this browser across reloads: open one (a new tab goes last, and it
 * becomes the most recently used), close one, bring a closed one back, and pick how many show side by side. Every
 * part of Home that reads them shares the same store.
 */
export function useOpenChats(viewerId: string) {
  const key = `journal.open-chats.${viewerId}`;
  const known = stores.get(key);
  const chats = known ?? reactive(readKept(key));

  if (known === undefined) {
    stores.set(key, chats);
    watch(
      () => ({ agentIds: chats.agentIds, recent: chats.recent }),
      (tabs) => keepStoredJson("local", key, tabs),
      { deep: true },
    );
  }

  function open(agentId: string): void {
    if (!chats.agentIds.includes(agentId)) {
      chats.agentIds = [...chats.agentIds, agentId];
    }

    chats.recent = [agentId, ...chats.recent.filter((id) => id !== agentId)];
  }

  function close(agentId: string): void {
    chats.agentIds = chats.agentIds.filter((id) => id !== agentId);
    chats.recent = chats.recent.filter((id) => id !== agentId);
  }

  // A closed tab comes back at the place it had, as the least recently used.
  function restore(agentId: string, place: number): void {
    const others = chats.agentIds.filter((id) => id !== agentId);
    chats.agentIds = [...others.slice(0, place), agentId, ...others.slice(place)];
    chats.recent = [...chats.recent.filter((id) => id !== agentId), agentId];
  }

  /**
   * Shows this many of the open chats side by side, never more than are open or than Home holds; one shows one chat.
   */
  function showColumns(count: number): void {
    chats.columns = Math.max(1, Math.min(count, MOST_COLUMNS, Math.max(1, chats.agentIds.length)));
  }

  /**
   * The column counts the user may pick now: one, and up to as many as there are open chats.
   */
  function columnChoices(): number[] {
    const most = Math.min(MOST_COLUMNS, Math.max(1, chats.agentIds.length));

    return Array.from({ length: most }, (_, index) => index + 1);
  }

  /**
   * The chats shown beside the chosen one: the most recently used other open chats, as many as the columns leave.
   */
  function besideOf(chosenId: string | undefined): string[] {
    return chats.recent.filter((id) => id !== chosenId).slice(0, chats.columns - 1);
  }

  return { chats, open, close, restore, showColumns, columnChoices, besideOf };
}
