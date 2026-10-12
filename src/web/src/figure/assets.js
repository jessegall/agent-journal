import {api} from "../api/client.js";

// The Cache API keeps figure files; the name a figure is stored under carries the hash of its content, so a changed figure is a new entry
export const FIGURE_CACHE = "voice-figures";

// the file a cached request is for; the cache holds its requests' urls whole
const fileName = (url) => new URL(url).pathname.split("/").pop();
const ofVoice = (url, voice) => fileName(url).startsWith(`${voice}.`);

// The bytes of the active voice's figure and nothing else: from the cache when this version is kept, else fetched and kept,
// with the voice's earlier versions dropped. Where the page has no Cache API (an insecure origin), the browser's own cache serves it.
export async function figureBytes(voice) {
    const index = await api.voiceFigures();
    const url = api.voiceFigureUrl(index[voice]);
    if (typeof caches === "undefined") return (await fetched(url, voice)).arrayBuffer();
    const kept = await caches.open(FIGURE_CACHE);
    const hit = await kept.match(url);
    if (hit) return hit.arrayBuffer();
    const response = await fetched(url, voice);
    await kept.put(url, response.clone());
    const stale = (await kept.keys()).filter((request) => ofVoice(request.url, voice) && fileName(request.url) !== index[voice]);
    await Promise.all(stale.map((request) => kept.delete(request)));
    return response.arrayBuffer();
}

async function fetched(url, voice) {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`The ${voice} figure did not load: ${response.status}`);
    return response;
}

// The active voice's figure, ready to pose; three.js and the figure module load only when a figure is asked for, so the page never waits on them
export async function loadVoiceFigure(voice) {
    const [{figureOf}, bytes] = await Promise.all([import("./figure.js"), figureBytes(voice)]);
    return figureOf(bytes, voice, api.figureDecoderUrl());
}
