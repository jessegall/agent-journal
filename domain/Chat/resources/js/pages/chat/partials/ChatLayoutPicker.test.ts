// @vitest-environment happy-dom
import { flushPromises, mount } from "@vue/test-utils";
import { describe, expect, it, vi } from "vitest";

vi.mock("@inertiajs/vue3", () => ({
  usePage: () => ({ url: "/", props: { drivers: [], viewer: { id: "user-layout" } } }),
}));

const { default: ChatLayoutPicker } = await import("./ChatLayoutPicker.vue");
const { useOpenChats } = await import("../../../composables/useOpenChats");

describe("ChatLayoutPicker", () => {
  it("is one icon that offers a layout per count of open chats, up to four, and picks how many show side by side", async () => {
    const chats = useOpenChats("user-layout");
    ["agent-1", "agent-2", "agent-3"].forEach((id) => chats.open(id));
    const picker = mount(ChatLayoutPicker);

    expect(picker.findAll("button")).toHaveLength(1);
    expect(picker.get("[data-chat-layout]").attributes("aria-label")).toBe("Chat layout: One chat");
    await picker.get("[data-chat-layout]").trigger("click");
    await flushPromises();

    expect(picker.findAll("[data-chat-layout-choice]").map((choice) => choice.attributes("aria-label"))).toEqual([
      "One chat",
      "2 chats side by side",
      "3 chats side by side",
    ]);
    await picker.get('[data-chat-layout-choice="3"]').trigger("click");

    expect([chats.chats.columns, chats.besideOf("agent-3")]).toEqual([3, ["agent-2", "agent-1"]]);
    expect(picker.find("[data-chat-layout-choice]").exists()).toBe(false);
  });
});
