import {expect, test} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import TunnelWindow from "../../core/modules/tunnel/web/src/TunnelWindow.vue";
import PhoneRows from "../../core/modules/phone/web/src/PhoneRows.vue";

test("the tunnel window says whether it is connected, its address, and why not", async () => {
    const element = await mounted(TunnelWindow, context({"tunnel status": {ok: true, value: {state: "connected", address: "https://shop.example", reason: ""}}}));
    expect(element.textContent).toContain("Connected");
    expect(element.querySelector("[data-tunnel-address]").textContent).toBe("https://shop.example");
    const off = await mounted(TunnelWindow, context({"tunnel status": {ok: true, value: {state: "disconnected", address: "", reason: "no tunnel is installed"}}}));
    expect(off.querySelector("[data-tunnel-reason]").textContent).toBe("no tunnel is installed");
});

test("pairing a phone shows its code and a QR code of its link", async () => {
    const window = context({"phone list": page([])});
    window.run = async () => ({ok: true, value: {code: "123456", link: "https://shop.example/pair#code=123456"}});
    const element = await mounted(PhoneRows, window);
    element.querySelector("button").click();
    await settle();
    expect(element.textContent).toContain("123456");
    expect(element.querySelector("svg[data-phone-qr], [data-phone-qr]")).not.toBeNull();
});
