// @vitest-environment node
import {afterEach, beforeEach, expect, test, vi} from "vitest";

const INDEX = {homie: "homie.b85a0a23497d.glb", butler: "butler.d9c2539fc286.glb"};

vi.mock("../src/api/client.js", () => ({
    api: {voiceFigures: async () => INDEX, voiceFigureUrl: (file) => `http://journal/voices/figures/${file}`, figureDecoderUrl: () => ""},
}));

const {FIGURE_CACHE, figureBytes} = await import("../src/figure/assets.js");

// the Cache API as the page sees it, one named cache keyed by url
function cacheStorage() {
    const entries = new Map();
    const cache = {
        match: async (url) => entries.get(url)?.clone(),
        put: async (url, response) => void entries.set(url, response),
        keys: async () => [...entries.keys()].map((url) => ({url})),
        delete: async (request) => entries.delete(request.url),
    };
    return {entries, open: async (name) => (name === FIGURE_CACHE ? cache : null)};
}

let fetched;

beforeEach(() => {
    fetched = [];
    vi.stubGlobal("fetch", async (url) => (fetched.push(url), new Response(`bytes of ${url.split("/").pop()}`)));
});

afterEach(() => vi.unstubAllGlobals());

test("only the active voice's figure is fetched, kept under its versioned name, and read from the cache after that", async () => {
    const storage = cacheStorage();
    vi.stubGlobal("caches", storage);
    const first = new TextDecoder().decode(await figureBytes("homie"));
    const again = new TextDecoder().decode(await figureBytes("homie"));
    expect([first, again]).toEqual(["bytes of homie.b85a0a23497d.glb", "bytes of homie.b85a0a23497d.glb"]);
    expect(fetched).toEqual(["http://journal/voices/figures/homie.b85a0a23497d.glb"]);
    expect([...storage.entries.keys()]).toEqual(["http://journal/voices/figures/homie.b85a0a23497d.glb"]);
});

test("a changed figure is a new name: the voice's earlier version is dropped and other voices' figures are kept", async () => {
    const storage = cacheStorage();
    storage.entries.set("http://journal/voices/figures/homie.000000000000.glb", new Response("old"));
    storage.entries.set("http://journal/voices/figures/butler.111111111111.glb", new Response("other"));
    vi.stubGlobal("caches", storage);
    await figureBytes("homie");
    expect([...storage.entries.keys()].sort()).toEqual([
        "http://journal/voices/figures/butler.111111111111.glb",
        "http://journal/voices/figures/homie.b85a0a23497d.glb",
    ]);
});

test("a page without the Cache API still gets the figure, from the network", async () => {
    vi.stubGlobal("caches", undefined);
    expect(new TextDecoder().decode(await figureBytes("butler"))).toBe("bytes of butler.d9c2539fc286.glb");
});
