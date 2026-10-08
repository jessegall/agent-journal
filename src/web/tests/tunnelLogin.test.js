import {createApp} from "vue";
import {beforeEach, describe, expect, test, vi} from "vitest";
import {flush} from "./flush.js";

const tunnelLogin = vi.fn();
vi.mock("../src/api/client.js", () => ({api: {tunnelLogin: (...a) => tunnelLogin(...a)}, onWrite: vi.fn()}));

const {default: TunnelLogin} = await import("../src/pages/TunnelLogin.vue");

async function open(host = "tunler.test") {
    const ready = vi.fn();
    const into = document.createElement("div");
    document.body.append(into);
    createApp(TunnelLogin, {host, onReady: ready}).mount(into);
    const type = (id, value) => {
        const field = into.querySelector(`#${id}`);
        field.value = value;
        field.dispatchEvent(new Event("input"));
    };
    type("tunnel-username", " ann ");
    type("tunnel-password", "secret-pass");
    await flush();
    const press = async () => {
        into.querySelector("button").click();
        await flush();
    };
    return {into, ready, press, type};
}

beforeEach(() => {
    document.body.innerHTML = "";
    tunnelLogin.mockReset();
});

describe("connecting tunler", () => {
    test("a connection tells the page it is ready, and the passwords are forgotten", async () => {
        tunnelLogin.mockResolvedValue({connected: true});
        const {into, ready, press} = await open();
        await press();
        expect(tunnelLogin).toHaveBeenCalledWith({endpoint: "tunler.test", username: "ann", password: "secret-pass", master_password: undefined});
        expect(ready).toHaveBeenCalledTimes(1);
        expect(into.querySelector("#tunnel-password").value).toBe("");
    });

    test("an unknown account asks for the master password and the button says what it will do", async () => {
        tunnelLogin.mockResolvedValue({connected: false, needs_master: true});
        const {into, ready, press} = await open();
        await press();
        expect(into.querySelector(".tunnel-note").textContent).toBe(`No account "ann" on tunler.test yet. Enter the server's master password to create it.`);
        expect(into.querySelector("button").textContent.trim()).toBe("Create the account");
        expect(ready).not.toHaveBeenCalled();
    });

    test("a refusal shows the server's words", async () => {
        tunnelLogin.mockResolvedValue({connected: false, needs_master: false, error: "login failed: wrong username or password"});
        const {into, press} = await open();
        await press();
        expect(into.querySelector(".tunnel-failure").textContent).toBe("login failed: wrong username or password");
    });

    test("a request that fails shows its message, and the button is usable again", async () => {
        tunnelLogin.mockRejectedValue(new Error("the journal did not answer"));
        const {into, press} = await open();
        await press();
        expect(into.querySelector(".tunnel-failure").textContent).toBe("the journal did not answer");
        expect(into.querySelector("button").disabled).toBe(false);
    });

    test("a second try clears the first failure", async () => {
        tunnelLogin.mockResolvedValueOnce({connected: false, error: "nope"}).mockResolvedValueOnce({connected: true});
        const {into, press} = await open();
        await press();
        await press();
        expect(into.querySelector(".tunnel-failure")).toBeNull();
    });
});
