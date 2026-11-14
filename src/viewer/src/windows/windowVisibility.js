// whether the person can see the viewer now: a window no pane shows is unmounted and asks nothing, so a window that
// asks is hidden only while the browser tab is
export function isViewerHidden(visibilityState = typeof document !== "undefined" ? document.visibilityState : "visible") {
    return visibilityState === "hidden";
}
