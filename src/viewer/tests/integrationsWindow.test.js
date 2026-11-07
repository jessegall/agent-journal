import {settle} from "./support/delayedWindowContext.js";
import {expect, test} from "vitest";
import {context, mounted, page} from "./support/windowContext.js";
import ServerRows from "../../core/modules/mcp/web/src/ServerRows.vue";


const KEYS = {
    installed: {line: "mcp list", events: ["mcp_server.*"]},
    suggested: {line: "mcp suggested"},
    check: {line: "mcp check"},
};

const LINEAR = {id: 1, name: "linear", title: "Linear", url: "https://mcp.linear.app/mcp", command: "", args: [], auth: "oauth", standing: "signs in on its own"};
const SHOP = {id: 2, name: "shop", title: "shop", url: "", command: "npx", args: ["-y", "shop"], auth: "none", standing: "ready"};

function integrations(lines = ["linear  written in .mcp.json and .codex/config.toml"]) {
    const window = context({"mcp list": page([LINEAR, SHOP]), "mcp suggested": page([]), "mcp check": {ok: true, value: {lines}}}, null, KEYS);
    window.lines = [];
    window.run = async (line) => {
        window.lines.push(line);
        return {ok: true, value: null};
    };
    return window;
}

test("a signing-in server asks the agent to sign in; another has no such button", async () => {
    const window = integrations();
    const element = await mounted(ServerRows, window);
    expect(element.querySelectorAll("[data-mcp-sign-in]").length).toBe(1);
    element.querySelector("[data-mcp-sign-in]").click();
    await settle();
    expect(window.lines[0][0]).toBe("message");
    expect(window.lines[0][2]).toContain("mcp__linear__authenticate");
    expect(element.querySelector("[data-mcp-notice]").textContent).toContain("Asked the agent to sign in to Linear");
});

test("a server is added by its name and its address or command", async () => {
    const window = integrations();
    const element = await mounted(ServerRows, window);
    const form = element.querySelector("[data-mcp-add]");
    const [name, target] = form.querySelectorAll("input");
    name.value = "shop";
    name.dispatchEvent(new Event("input"));
    target.value = "npx -y shop";
    target.dispatchEvent(new Event("input"));
    form.dispatchEvent(new Event("submit"));
    await settle();
    expect(window.lines).toEqual([["mcp", "add", "shop", "npx -y shop"]]);
    expect(name.value).toBe("");
});

test("each server shows how it is reached and what the check found, and refresh reads again", async () => {
    const window = integrations();
    const element = await mounted(ServerRows, window);
    expect(element.querySelector("[data-mcp-check]").textContent).toBe("written in .mcp.json and .codex/config.toml");
    expect(element.textContent).toContain("npx -y shop");
    expect(element.querySelector("[data-mcp-checked]")).not.toBeNull();
    const checks = window.reads.filter((line) => line === "mcp check").length;
    element.querySelector("[data-mcp-refresh]").click();
    await settle();
    expect(window.reads.filter((line) => line === "mcp check").length).toBe(checks + 1);
});
