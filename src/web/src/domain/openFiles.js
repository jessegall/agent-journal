// The files open as tabs on the Files page, in the order they were opened.

export const opened = (tabs, path) => (!path || tabs.includes(path) ? tabs : [...tabs, path]);

export const closed = (tabs, path) => tabs.filter((tab) => tab !== path);

// The file shown once a tab closes: the same one when another tab closed, else its neighbour, the next before the previous; none when it was the last.
export function shownAfterClosing(tabs, path, shown) {
    if (path !== shown) return shown;
    const left = closed(tabs, path);
    return left[Math.min(tabs.indexOf(path), left.length - 1)] || "";
}

export const tabName = (path) => path.split("/").pop();

// The folders a file lies in, outermost first, so a tree can open down to it.
export function foldersAbove(path) {
    const parts = path.split("/").slice(0, -1);
    return parts.map((_, i) => parts.slice(0, i + 1).join("/"));
}
