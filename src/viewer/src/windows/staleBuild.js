const STORAGE_KEY = "journal.stale-build-reload";

// a window file newer than the kit this page holds in memory names an export the old kit lacks: only a new page load fixes that
export const isStaleBuild = (error) => /does not provide an export/.test(String(error?.message ?? ""));

// reloads the page for this failure, once, so a file that really lacks the export shows its failure and does not reload for ever
export function reloadForNewBuild(error, storage = window.sessionStorage, reload = () => window.location.reload()) {
    try {
        if (storage.getItem(STORAGE_KEY) === error.message) return false;
        storage.setItem(STORAGE_KEY, error.message);
    } catch {
        return false;
    }
    reload();
    return true;
}

export function forgetBuildReload(storage = window.sessionStorage) {
    try {
        storage.removeItem(STORAGE_KEY);
    } catch {
        return;
    }
}
