// @vitest-environment happy-dom
import { describe, expect, it } from "vitest";
import { useOpenChats } from "./useOpenChats";

describe("useOpenChats", () => {
  it("brings back the tabs kept in the browser but opens one chat at a time, whatever was shown last", () => {
    localStorage.setItem(
      "journal.open-chats.user-kept",
      JSON.stringify({ agentIds: ["agent-2", "agent-3"], recent: ["agent-3", "agent-2"], mode: "side" }),
    );

    const chats = useOpenChats("user-kept");

    expect([chats.chats.agentIds, chats.chats.mode, chats.besideOf("agent-2")]).toEqual([
      ["agent-2", "agent-3"],
      "one",
      [],
    ]);
  });

  it("shows side by side only once the user picks it, and keeps only the tabs", () => {
    const chats = useOpenChats("user-picks");
    chats.open("agent-2");
    chats.open("agent-3");

    chats.show("side");

    expect(chats.besideOf("agent-3")).toEqual(["agent-2"]);
  });
});
