import {afterEach, beforeEach, expect, test, vi} from "vitest";
import {context, mounted, page, settle} from "./support/windowContext.js";
import {pluginWindowContext} from "./support/pluginWindowContext.js";
import {checkWindowContext} from "./support/checkWindowContext.js";
import {itemsOf, labelsOf} from "./support/cardMenu.js";
import ServerRows from "../../core/modules/mcp/web/src/ServerRows.vue";
import SecretRows from "../../core/modules/secrets/web/src/SecretRows.vue";
import PluginRows from "../../core/modules/plugins/web/src/PluginRows.vue";
import CheckCards from "../../suites/coding/modules/checks/web/src/CheckCards.vue";

beforeEach(() => vi.stubGlobal("ResizeObserver", class {observe() {} disconnect() {}}));
afterEach(() => {
    document.body.innerHTML = "";
    vi.unstubAllGlobals();
});

const KEYS = {installed: {line: "mcp list", events: ["mcp_server.*"]}, suggested: {line: "mcp suggested"}, check: {line: "mcp check"}};
const LINEAR = {id: 1, name: "linear", title: "Linear", url: "https://mcp.linear.app/mcp", command: "", args: [], auth: "oauth", standing: "signs in on its own", key_variable: ""};
const SHOP = {id: 2, name: "shop", title: "shop", url: "", command: "npx", args: ["-y", "shop"], auth: "none", standing: "needs its key", key_variable: "SHOP_KEY"};
const SUGGESTED = {id: 9, name: "docs", title: "Docs", subject: "Reads the project's documents", admission: ""};

async function integrations(answers = {}) {
    const lines = ["linear  written in .mcp.json and .codex/config.toml", "shop  needs its key: journal mcp key shop <value>"];
    const window = context({"mcp list": page([LINEAR, SHOP]), "mcp suggested": page([SUGGESTED]), "mcp check": {ok: true, value: {lines}}, ...answers}, null, KEYS);
    window.run = async () => ({ok: true, value: null});
    const element = await mounted(ServerRows, window);
    document.body.append(element);
    await settle();
    return element;
}

test("test_integrations_no_connected_badge: a connected server shows no Connected word, and the State filter offers Connected and Failed", async () => {
    const element = await integrations();
    expect(element.querySelector('[data-row="1"]').textContent).not.toContain("Connected");
    expect(element.querySelector("[data-filter-bar]")).not.toBeNull();
    expect([...element.querySelectorAll(".card-page-group")].map((group) => group.textContent)).toEqual(["Installed", "Suggested"]);
    expect(element.querySelector('[data-row="suggested-9"] [data-mcp-install]')).not.toBeNull();
});

test("test_failed_once: a failed server says Failed once, in its notice, and its foot holds Check", async () => {
    const element = await integrations();
    const card = element.querySelector('[data-row="2"]');
    expect(card.querySelector("[data-card-fault]").textContent).toBe("Failed to connect · needs its key");
    expect(card.textContent.match(/Failed/g)).toHaveLength(1);
    expect(card.querySelector("[data-card-foot] [data-mcp-check]")).not.toBeNull();
    expect(element.querySelector('[data-row="1"] [data-card-fault]')).toBeNull();
    expect(labelsOf(card)).toEqual(["Check", "Copy address", "Secret", "Remove"]);
});

const SECRET = {id: 3, title: "Shop key", brief: "For the shop", secret_type: "api key", fields: [{name: "key", hidden: true}], filled: ["key"], programs: [], proposed: [], helpers: false, waiting: false};

test("test_secret_delete_no_undo: a secret's delete asks in the words of an erase and says it is erased, with no Undo", async () => {
    const ran = [];
    const window = context({"secret list": page([SECRET])}, null, {secrets: {line: "secret list", events: ["secret.*"]}});
    window.run = async (line) => (ran.push(line), {ok: true, value: {}});
    const element = await mounted(SecretRows, window);
    const del = itemsOf(element.querySelector('[data-row="3"]')).find((entry) => entry.label === "Delete");
    expect(del.armedLabel).toBe("Click again: the value is erased for good");
    const said = [];
    await del.run({say: (...args) => said.push(args)});
    expect(ran).toEqual([["secret", "delete", "3"]]);
    expect(said).toEqual([["Deleted Shop key. The value is erased."]]);
});

test("test_cards_same_lines: every card of the four pages has the same lines in the same places", async () => {
    const plugin = pluginWindowContext({"plugin list": page([{id: 1, name: "sins", title: "Sins", release: "1.0", enabled: true, source: "owner/sins", failing: false}]), "plugin dashboards": page([]), "plugin descriptions": page([]), "plugin services": page([])});
    const check = checkWindowContext({"check list": page([{id: 5, title: "Lint", command: "lint", stopped: false, last_passed: true, run_percent: null}])});
    const secret = context({"secret list": page([SECRET])}, null, {secrets: {line: "secret list", events: ["secret.*"]}});
    const pages = [[PluginRows, plugin], [CheckCards, check], [SecretRows, secret]];
    const shapes = [];
    for (const [component, window] of pages) {
        const element = await mounted(component, window);
        document.body.append(element);
        await settle();
        const card = element.querySelector("[data-page-card]");
        shapes.push([...card.children].map((part) => part.tagName + (part.dataset.cardState !== undefined ? ":state" : part.dataset.cardLine !== undefined ? ":line" : "")));
        expect(card.querySelector("[data-card-foot]")).not.toBeNull();
        expect(card.querySelector("[data-actions-menu]")).not.toBeNull();
    }
    const first = await integrations();
    shapes.push([...first.querySelector('[data-row="1"]').children].map((part) => part.tagName + (part.dataset.cardState !== undefined ? ":state" : part.dataset.cardLine !== undefined ? ":line" : "")));
    for (const shape of shapes) expect(shape.at(-1)).toBe("FOOTER");
    for (const shape of shapes) expect(shape[0]).toBe("HEADER");
});
