// The phone's service worker: it keeps the shell page and the shell's own files for a start without a network, and
// keeps no data; a push shows only how many things wait, never what they are; a tap opens the window that holds it.
const TAG = "needs-you";
const SHELL = "phone-shell-v2";
const HOME = "/viewer/";
const OWN = /^\/viewer\/(assets\/[^/]+|icon-\d+\.png|manifest\.webmanifest)$/;
const ASSETS = /\/viewer\/assets\/[\w.-]+/g;
const WAITING = "/api/waiting";

const absolute = (path) => new URL(path, self.location.origin).href;
const listed = (html) => new Set([...html.matchAll(ASSETS)].map((match) => absolute(match[0])));

async function kept(html) {
    const cache = await caches.open(SHELL);
    const wanted = listed(html);
    for (const request of await cache.keys()) if (request.url.includes("/assets/") && !wanted.has(request.url)) await cache.delete(request);
    await Promise.all([...wanted].map(async (url) => (await cache.match(url)) || cache.add(url).catch(() => {})));
}

async function shell(request) {
    const cache = await caches.open(SHELL);
    try {
        const answer = await fetch(request);
        if (answer.ok) {
            await cache.put(absolute(HOME), answer.clone());
            kept(await answer.clone().text());
        }
        return answer;
    } catch (error) {
        return (await cache.match(absolute(HOME))) || Response.error();
    }
}

async function asset(request) {
    const cache = await caches.open(SHELL);
    const held = await cache.match(request);
    if (held) return held;
    const answer = await fetch(request);
    if (answer.ok) cache.put(request, answer.clone());
    return answer;
}

async function waiting() {
    try {
        const answer = await fetch(WAITING, {credentials: "same-origin", cache: "no-store"});
        return (await answer.json()).waiting || [];
    } catch (error) {
        return [];
    }
}

self.addEventListener("install", () => self.skipWaiting());

self.addEventListener("activate", (event) => {
    event.waitUntil(
        (async () => {
            for (const key of await caches.keys()) if (key !== SHELL) await caches.delete(key);
            await self.clients.claim();
        })(),
    );
});

self.addEventListener("fetch", (event) => {
    const request = event.request;
    if (request.method !== "GET") return;
    const url = new URL(request.url);
    if (url.origin !== self.location.origin) return;
    if (request.mode === "navigate" && url.pathname === HOME) return event.respondWith(shell(request));
    if (OWN.test(url.pathname)) event.respondWith(asset(request));
});

self.addEventListener("push", (event) => {
    event.waitUntil(
        (async () => {
            const things = await waiting();
            if (self.navigator.setAppBadge) await self.navigator.setAppBadge(things.length).catch(() => {});
            const title = things.length > 1 ? `${things.length} things need you` : "Your agent needs you";
            const data = {ref: things.length ? things[0].ref : ""};
            await self.registration.showNotification(title, {body: "Open the journal to see what waits.", tag: TAG, renotify: true, icon: "/viewer/icon-192.png", data});
        })(),
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const ref = (event.notification.data && event.notification.data.ref) || "";
    event.waitUntil(
        (async () => {
            const open = await self.clients.matchAll({type: "window", includeUncontrolled: true});
            if (!open.length) return self.clients.openWindow(ref ? `${HOME}#open=${encodeURIComponent(ref)}` : HOME);
            if (ref) open[0].postMessage({open: ref});
            return open[0].focus();
        })(),
    );
});
