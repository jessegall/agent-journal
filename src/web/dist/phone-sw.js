const TAG = "needs-you";
const SHELL = "phone-shell-v1";
const OWN = /\/assets\/[^/]+$|\/icon-\d+\.png$|\/manifest\.webmanifest$/;
const ASSETS = /\.\/assets\/[\w.-]+/g;

const scoped = (path) => new URL(path, self.registration.scope).href;
const home = () => new URL(self.registration.scope).pathname;
const listed = (html) => new Set([...html.matchAll(ASSETS)].map((found) => scoped(found[0])));

async function kept(html) {
    const cache = await caches.open(SHELL);
    const wanted = listed(html);
    for (const request of await cache.keys()) if (request.url.includes("/assets/") && !wanted.has(request.url)) await cache.delete(request);
    await Promise.all([...wanted].map(async (url) => (await cache.match(url)) || cache.add(url).catch(() => {})));
}

async function shell(request) {
    const cache = await caches.open(SHELL);
    try {
        const got = await fetch(request);
        if (got.ok) {
            await cache.put(scoped("./"), got.clone());
            kept(await got.clone().text());
        }
        return got;
    } catch (error) {
        return (await cache.match(scoped("./"))) || Response.error();
    }
}

async function asset(request) {
    const cache = await caches.open(SHELL);
    const held = await cache.match(request);
    if (held) return held;
    const got = await fetch(request);
    if (got.ok) cache.put(request, got.clone());
    return got;
}

self.addEventListener("install", (event) => {
    self.skipWaiting();
    event.waitUntil(
        (async () => {
            const got = await fetch(scoped("./"), {cache: "no-store"});
            if (!got.ok) return;
            await (await caches.open(SHELL)).put(scoped("./"), got.clone());
            await kept(await got.text());
        })().catch(() => {}),
    );
});

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
    if (request.mode === "navigate" && url.pathname === home()) return event.respondWith(shell(request));
    if (OWN.test(url.pathname)) event.respondWith(asset(request));
});

async function told() {
    try {
        const answer = await fetch("./feed", {credentials: "same-origin", cache: "no-store"});
        const waiting = (await answer.json()).waiting || [];
        return waiting;
    } catch (error) {
        return [];
    }
}

self.addEventListener("push", (event) => {
    event.waitUntil(
        (async () => {
            const waiting = await told();
            if (self.navigator.setAppBadge) await self.navigator.setAppBadge(waiting.length).catch(() => {});
            const title = waiting.length > 1 ? `${waiting.length} things need you` : "Your agent needs you";
            const body = waiting.length ? waiting[0].title : "Open the journal to see what waits.";
            const data = {ref: waiting.length ? waiting[0].ref : ""};
            await self.registration.showNotification(title, {body, tag: TAG, renotify: true, icon: "./icon-192.png", data});
        })(),
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    const ref = (event.notification.data && event.notification.data.ref) || "";
    event.waitUntil(
        (async () => {
            const open = await self.clients.matchAll({type: "window", includeUncontrolled: true});
            if (!open.length) return self.clients.openWindow(ref ? `./#open=${encodeURIComponent(ref)}` : "./");
            if (ref) open[0].postMessage({open: ref});
            return open[0].focus();
        })(),
    );
});
