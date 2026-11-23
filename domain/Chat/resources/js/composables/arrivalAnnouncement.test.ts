import { describe, expect, it } from "vitest";
import type { ChatMessageData } from "@generated/types/chat";
import { arrivalAnnouncement } from "./arrivalAnnouncement";

function row(
  id: string,
  actor: string,
  label: string,
  addressedTo: string | null = null,
): ChatMessageData {
  return {
    id,
    speaker: { actor, label, driver: null },
    addressedTo,
  } as ChatMessageData;
}

describe("arrivalAnnouncement", () => {
  it("stays quiet on the first rows and on replays, and names each new post once", () => {
    const announce = arrivalAnnouncement(
      () => "user:bea",
      (actor) => (actor === "user:bea" ? "Bea" : actor),
    );
    const first = [row("m1", "user:ada", "Ada")];

    expect(announce(first)).toBeNull();
    expect(announce(first)).toBeNull();

    const next = [
      ...first,
      row("m2", "agent:codex", "Codex", "user:bea"),
      row("m3", "user:bea", "Bea"),
    ];
    expect(announce(next)).toBe("New message from Codex to Bea.");
    expect(announce(next)).toBeNull();
  });
});
