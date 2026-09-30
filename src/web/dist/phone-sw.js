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
            await self.registration.showNotification(title, {body, tag: TAG, renotify: true, icon: "./icon-192.png"});
        })(),
    );
});

self.addEventListener("notificationclick", (event) => {
    event.notification.close();
    event.waitUntil(
        self.clients.matchAll({type: "window"}).then((open) => (open.length ? open[0].focus() : self.clients.openWindow("./"))),
    );
});
