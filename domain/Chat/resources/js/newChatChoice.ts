import { keepStoredJson, readStoredJson } from "@kit/browserStorage";

/**
 * What a user last started a new chat on, kept in this browser so the next new chat preselects it: the driver family,
 * the account with the sign-in revision seen, the model and the effort.
 */
export type NewChatChoice = {
  family: string;
  accountId: string | null;
  accountRevision: number | null;
  model: string;
  effort: string;
};

function storageKeyOf(viewerId: string): string {
  return `journal.new-chat-choice.${viewerId}`;
}

export function readNewChatChoice(viewerId: string): Partial<NewChatChoice> | null {
  return readStoredJson<Partial<NewChatChoice>>("local", storageKeyOf(viewerId), (decoded) =>
    typeof decoded === "object" && decoded !== null ? (decoded as Partial<NewChatChoice>) : null,
  );
}

export function keepNewChatChoice(viewerId: string, choice: NewChatChoice): void {
  keepStoredJson("local", storageKeyOf(viewerId), choice);
}
