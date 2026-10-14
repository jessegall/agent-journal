const DB = "phone-outbox";
const STORE = "files";

function opened() {
    return new Promise((resolve, reject) => {
        const asked = indexedDB.open(DB, 1);
        asked.onupgradeneeded = () => asked.result.createObjectStore(STORE);
        asked.onsuccess = () => resolve(asked.result);
        asked.onerror = () => reject(asked.error);
    });
}

async function run(mode, work) {
    const db = await opened();
    return new Promise((resolve, reject) => {
        const done = db.transaction(STORE, mode);
        const asked = work(done.objectStore(STORE));
        done.oncomplete = () => resolve(asked.result);
        done.onerror = () => reject(done.error);
        done.onabort = () => reject(done.error);
    });
}

export const stash = (key, files) => run("readwrite", (store) => store.put(files, key)).catch(() => {});
export const unstash = (key) => run("readonly", (store) => store.get(key)).catch(() => undefined);
export const unstashed = (key) => run("readwrite", (store) => store.delete(key)).catch(() => {});
