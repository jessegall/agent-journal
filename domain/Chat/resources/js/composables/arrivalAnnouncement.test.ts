import { describe, expect, it } from "vitest";
import type { ChatEntryData, ChatMessageType } from "@generated/types/chat";
import { arrivalAnnouncement } from "./arrivalAnnouncement";

function entry(
  id: string,
  author: string,
  authorLabel: string | null,
  type: ChatMessageType = "message",
): ChatEntryData {
  return { id, author, authorLabel, type } as ChatEntryData;
}

describe("arrivalAnnouncement", () => {
  it("stays quiet on the first entries and on replays, and names each new message or question by another once", () => {
    const announce = arrivalAnnouncement(() => "user:bea");
    const first = [entry("m1", "user:ada", "Ada")];

    expect(announce(first)).toBeNull();
    expect(announce(first)).toBeNull();

    const next = [
      ...first,
      entry("m2", "agent:codex", "Codex"),
      entry("m3", "user:bea", "Bea"),
      entry("q1", "agent:codex", "Codex", "question"),
      entry("r1", "user:ada", "Ada", "reaction"),
    ];
    expect(announce(next)).toBe("New message from Codex. New question from Codex.");
    expect(announce(next)).toBeNull();
  });

  it("names an author who left the chat as someone who left", () => {
    const announce = arrivalAnnouncement(() => "user:bea");
    announce([]);

    expect(announce([entry("m1", "user:gone", null)])).toBe("New message from someone who left.");
  });
});
