self.addEventListener("fetch", (event) => {
    event.waitUntil(
        (async () => {
            const cache = await caches.open("phone-shell");
            // @sin architecture_viewer_WorkerCachesNoDataDetector
            await cache.put("/api/windows", await fetch("/api/windows"));
            // @righteous architecture_viewer_WorkerCachesNoDataDetector
            await cache.put("/viewer/", await fetch("/viewer/"));
            // @sin architecture_viewer_WorkerCachesNoDataDetector
            await self.registration.showNotification(things[0].title, {body: "one thing"});
            // @righteous architecture_viewer_WorkerCachesNoDataDetector
            await self.registration.showNotification("Your agent needs you", {body: "Open the journal to see what waits."});
        })(),
    );
});
