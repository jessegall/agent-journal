import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {phoneWindowContext} from "./support/phoneWindowContext.js";
import TunnelWindow from "../../core/modules/tunnel/web/src/TunnelWindow.vue";
import PhoneRows from "../../core/modules/phone/web/src/PhoneRows.vue";
import TunlerAccount from "../../tunnels/tunler/web/src/TunlerAccount.vue";

const tunnelContext = (answers) => context(answers, null, {status: {line: "tunnel status"}});

test("the tunnel window says whether it is connected, its address, and justification not", async () => {
    const element = await mounted(TunnelWindow, tunnelContext({"tunnel status": {ok: true, value: {state: "connected", address: "https://shop.example", reason: ""}}}));
    expect(element.textContent).toContain("Connected");
    expect(element.querySelector("[data-tunnel-address]").textContent).toBe("https://shop.example");
    const off = await mounted(TunnelWindow, tunnelContext({"tunnel status": {ok: true, value: {state: "disconnected", address: "", reason: "no tunnel is installed"}}}));
    expect(off.querySelector("[data-tunnel-reason]").textContent).toBe("no tunnel is installed");
});

test("pairing a phone shows its code and a QR code of its link", async () => {
    const window = phoneWindowContext({"phone list": page([])});
    window.run = async () => ({ok: true, value: {code: "123456", link: "https://shop.example/pair#code=123456"}});
    const element = await mounted(PhoneRows, window);
    element.querySelector("button").click();
    await settle();
    expect(element.textContent).toContain("123456");
    expect(element.querySelector("svg[data-phone-qr], [data-phone-qr]")).not.toBeNull();
});

test("the phone window says justification a phone cannot reach the journal, and what a paired phone can do", async () => {
    const element = await mounted(PhoneRows, phoneWindowContext({"phone list": page([]), "tunnel status": {ok: true, value: {state: "disconnected", address: "", reason: "no tunnel service is chosen"}}}));
    expect(element.querySelector("[data-phone-tunnel]").textContent).toContain("no tunnel service is chosen");
    expect(element.querySelector("[data-phone-abilities]").textContent).toContain("Answer questions");
    const connected = await mounted(PhoneRows, phoneWindowContext({"phone list": page([]), "tunnel status": {ok: true, value: {state: "connected", address: "shop.example", reason: ""}}}));
    expect(connected.querySelector("[data-phone-tunnel]")).toBeNull();
});

const SIGNED_IN = {installed: true, authenticated: true, rejected: false, account: "ada", host: "tunnels.example", command: "/bin/tunler", subdomain: "cart", in_use: true};
const LINES = {
    "tunler status": {ok: true, value: SIGNED_IN},
    "tunler version": {ok: true, value: {current: "v0.2.0", latest: "v0.3.0", update_available: true}},
    "tunler domains": {ok: true, value: {domains: [{name: "cart.tunnels.example", own: true}, {name: "old.tunnels.example", own: false}]}},
};

function recording(answers) {
    const window = context(answers);
    window.lines = [];
    window.run = async (line) => {
        window.lines.push(line);
        return {ok: true, value: {connected: true}};
    };
    return window;
}

test("the tunler window says who is connected, offers the update and logs out", async () => {
    const window = recording(LINES);
    const element = await mounted(TunlerAccount, window);
    expect(element.querySelector("[data-tunler-account]").textContent).toContain("ada");
    expect(element.querySelector("[data-tunler-version]").textContent).toContain("v0.3.0 is available");
    element.querySelector("[data-tunler-update]").click();
    await settle();
    element.querySelector("[data-tunler-logout]").click();
    await settle();
    expect(window.lines).toEqual([["tunler", "update"], ["tunler", "logout"]]);
});

test("the tunler window logs in and asks for the master password for a new account", async () => {
    const window = recording({...LINES, "tunler status": {ok: true, value: {...SIGNED_IN, authenticated: false, account: null}}});
    window.run = async () => ({ok: true, value: {connected: false, needs_master: true, error: "give the master password"}});
    const element = await mounted(TunlerAccount, window);
    const form = element.querySelector("[data-tunler-login]");
    expect(form.querySelector("#tunler-server").value).toBe("tunnels.example");
    form.dispatchEvent(new Event("submit"));
    await settle();
    expect(element.querySelector("[data-tunler-login-failure]").textContent).toBe("give the master password");
    expect(element.querySelector("[data-tunler-connect]").textContent).toContain("Create the account");
});

test("the tunler window offers the install when tunler is missing", async () => {
    const window = recording({...LINES, "tunler status": {ok: true, value: {...SIGNED_IN, installed: false, authenticated: false}}, "tunler version": {ok: true, value: {current: null, latest: null, update_available: false}}});
    const element = await mounted(TunlerAccount, window);
    const form = element.querySelector("[data-tunler-install]");
    const input = form.querySelector("input");
    input.value = "tunnels.example";
    input.dispatchEvent(new Event("input"));
    form.dispatchEvent(new Event("submit"));
    await settle();
    expect(window.lines).toEqual([["tunler", "install", "tunnels.example"]]);
});

test("a domain is released only after asking, and the one in use moves to a new name first", async () => {
    const window = recording(LINES);
    const element = await mounted(TunlerAccount, window);
    element.querySelector('[data-tunler-domain="old.tunnels.example"] [data-tunler-release]').click();
    await settle();
    expect(window.lines).toEqual([]);
    element.querySelector("[data-tunler-release-confirm]").click();
    await settle();
    expect(window.lines).toEqual([["tunler", "release", "old.tunnels.example"]]);
    element.querySelector('[data-tunler-domain="cart.tunnels.example"] [data-tunler-release]').click();
    await settle();
    const form = element.querySelector("[data-tunler-move]");
    const input = form.querySelector("input");
    input.value = "shop";
    input.dispatchEvent(new Event("input"));
    form.dispatchEvent(new Event("submit"));
    await settle();
    expect(window.lines.slice(1)).toEqual([["setting", "set", "journal.tunnels.tunler.subdomain", "shop", "--project"], ["tunler", "release", "cart.tunnels.example"]]);
});

test("using tunler sets the subdomain before the service", async () => {
    const window = recording({...LINES, "tunler status": {ok: true, value: {...SIGNED_IN, subdomain: null, in_use: false}}});
    const element = await mounted(TunlerAccount, window);
    const form = element.querySelector("[data-tunler-use]");
    const input = form.querySelector("input");
    input.value = "cart";
    input.dispatchEvent(new Event("input"));
    form.dispatchEvent(new Event("submit"));
    await settle();
    expect(window.lines).toEqual([["setting", "set", "journal.tunnels.tunler.subdomain", "cart", "--project"], ["setting", "set", "journal.core.tunnel.service", "tunler", "--project"]]);
});
