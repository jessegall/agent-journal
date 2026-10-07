import {phone} from "../api/phone.js";

export const pushPossible = "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;

function bytes(key) {
    const padded = (key + "===".slice((key.length + 3) % 4)).replace(/-/g, "+").replace(/_/g, "/");
    return Uint8Array.from(atob(padded), (c) => c.charCodeAt(0));
}

export async function subscribed() {
    const worker = await navigator.serviceWorker.register("./sw.js", {scope: "./"});
    const held = await worker.pushManager.getSubscription();
    const made =
        held || (await worker.pushManager.subscribe({userVisibleOnly: true, applicationServerKey: bytes((await phone.pushKey()).key)}));
    await phone.subscribe(made.endpoint);
}
