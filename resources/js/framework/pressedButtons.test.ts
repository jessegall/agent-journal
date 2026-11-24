// @vitest-environment happy-dom
import { afterEach, describe, expect, it, vi } from "vitest";

type Listener = (event: {
  detail: { visit: object };
  defaultPrevented: boolean;
}) => void;

const listeners = vi.hoisted(() => new Map<string, Set<Listener>>());

vi.mock("@inertiajs/vue3", () => ({
  router: {
    on: (name: string, listener: Listener) => {
      const named = listeners.get(name) ?? new Set<Listener>();
      named.add(listener);
      listeners.set(name, named);

      return () => named.delete(listener);
    },
  },
}));

const { pressedButtons } = await import("./pressedButtons");

pressedButtons.watch();

function emit(name: string, visit: object): void {
  for (const listener of listeners.get(name) ?? []) {
    listener({ detail: { visit }, defaultPrevented: false });
  }
}

function buttonClickedWith(handler: () => void): HTMLButtonElement {
  const button = document.createElement("button");
  button.textContent = "Save";
  button.addEventListener("click", handler);
  document.body.append(button);
  button.click();

  return button;
}

afterEach(() => {
  document.body.innerHTML = "";
});

describe("a pressed button", () => {
  it("shows its spinner and is disabled while the request its click sent is in flight", () => {
    let hold = pressedButtons.hold();
    const button = buttonClickedWith(() => {
      hold = pressedButtons.hold();
    });

    expect(button.dataset.busy).toBe("1");
    expect(button.disabled).toBe(true);

    hold.release();

    expect(button.dataset.busy).toBeUndefined();
    expect(button.disabled).toBe(false);
  });

  it("stays as it was when a request is sent outside a click", async () => {
    const button = buttonClickedWith(() => {});
    await new Promise((resolve) => setTimeout(resolve));

    const hold = pressedButtons.hold();

    expect(button.dataset.busy).toBeUndefined();
    hold.release();
  });

  it("is held for the Inertia visit its click started, until that visit finishes", () => {
    const visit = { method: "post" };
    const button = buttonClickedWith(() => emit("before", visit));

    expect(button.dataset.busy).toBe("1");

    emit("finish", { method: "get" });
    expect(button.dataset.busy).toBe("1");

    emit("finish", visit);
    expect(button.dataset.busy).toBeUndefined();
    expect(button.disabled).toBe(false);
  });

  it("is given back when Inertia finishes a copy of the visit it started, as it does for every visit", () => {
    const visit = { method: "post" };
    const button = buttonClickedWith(() => emit("before", visit));

    emit("finish", { ...visit });

    expect(button.dataset.busy).toBeUndefined();
    expect(button.disabled).toBe(false);
  });
});
