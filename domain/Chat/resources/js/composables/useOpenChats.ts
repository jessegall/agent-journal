import { reactive, watch } from "vue";
import { keepStoredJson, readStoredJson } from "@kit/browserStorage";

/**
 * How Home shows its open chats: one at a time, or side by side as columns.
 */
export type ChatViewMode = "one" | "side";

/**
 * The chats one user keeps open on Home: the tabs in their order, the same chats the most recently used first, and
 * how they show. Only the tabs are kept across reloads: Home always opens one chat at a time.
 */
export type OpenChats = { agentIds: string[]; recent: string[]; mode: ChatViewMode };

type KeptChats = Pick<OpenChats, "agentIds" | "recent">;

/**
 * The most chats shown beside the chosen one, as the chat window's query allows.
 */
export const MOST_BESIDE = 3;

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
  return { ...kept, mode: "one" };
}

/**
 * The open chats of one user, their tabs kept in this browser across reloads: open one (a new tab goes last, and it
 * becomes the most recently used), close one, bring a closed one back, and switch the view mode for this page. Every
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

  function show(mode: ChatViewMode): void {
    chats.mode = mode;
  }

  /**
   * The chats shown beside the chosen one: side by side, the most recently used other open chats; none one at a time.
   */
  function besideOf(chosenId: string | undefined): string[] {
    return chats.mode === "side" ? chats.recent.filter((id) => id !== chosenId).slice(0, MOST_BESIDE) : [];
  }

  return { chats, open, close, restore, show, besideOf };
}
