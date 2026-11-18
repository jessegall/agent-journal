import {createApp, h, nextTick, ref} from "vue";
import {describe, expect, test, vi} from "vitest";
import IntegrationServer from "../src/pages/IntegrationServer.vue";
import {signsIn, SIGN_IN_WORDS} from "../src/domain/mcpSignIn.js";

const SENTRY = {
    name: "sentry",
    title: "sentry",
    transport: "http",
    state: "needs_auth",
    managed: false,
    url: "https://mcp.sentry.dev/mcp",
    auth: "oauth",
    last_error: "",
};
const PAGE = "https://mcp.sentry.dev/oauth/authorize?state=s&redirect_uri=http%3A%2F%2Flocalhost%3A56271%2Fcallback";

function shown(props, listeners = {}) {
    const root = document.createElement("div");
    const returned = ref("");
    createApp({
        render: () =>
            h(IntegrationServer, {
                server: SENTRY,
                ...props,
                returnAddress: returned.value,
                "onUpdate:returnAddress": (value) => (returned.value = value),
                ...listeners,
            }),
    }).mount(root);
    return root;
}

describe("signing in to an MCP server", () => {
    test("is offered for a server that signs in, the journal's or the agent program's own", () => {
        expect([signsIn(SENTRY), signsIn({...SENTRY, auth: "none"}), signsIn({...SENTRY, auth: "key"})]).toEqual([true, false, false]);
        const root = shown({});
        expect(root.textContent).toContain(SIGN_IN_WORDS.offer);
        expect([...root.querySelectorAll("button")].map((b) => b.textContent.trim())).toEqual(["Remove", SIGN_IN_WORDS.button]);
        expect(shown({server: {...SENTRY, state: "connected", auth: "none"}}).textContent).not.toContain(SIGN_IN_WORDS.offer);
    });

    test("shows the sign-in page as a link and finishes only once the address the browser ended on is pasted", async () => {
        const finished = vi.fn();
        const root = shown({signInPage: PAGE}, {onFinishSignIn: finished});
        const link = root.querySelector("a");
        expect([link.textContent, link.getAttribute("href"), link.getAttribute("target")]).toEqual([SIGN_IN_WORDS.open, PAGE, "_blank"]);
        expect(root.querySelector("input").getAttribute("placeholder")).toBe(SIGN_IN_WORDS.placeholder);
        const finish = [...root.querySelectorAll("button")].find((b) => b.textContent.includes(SIGN_IN_WORDS.finish));
        expect(finish.disabled).toBe(true);
        const input = root.querySelector("input");
        input.value = "http://localhost:56271/callback?code=c&state=s";
        input.dispatchEvent(new Event("input"));
        await nextTick();
        expect(finish.disabled).toBe(false);
        finish.click();
        expect(finished).toHaveBeenCalledTimes(1);
    });
});
