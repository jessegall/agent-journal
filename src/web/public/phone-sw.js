const TAG = "needs-you";

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
