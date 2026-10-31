export function worded(mark, kind) {
    return {
        // @sin architecture_viewer_MarkEndsOnlyForProcessDetector
        ended: mark.state === "ended",
        // @righteous architecture_viewer_MarkEndsOnlyForProcessDetector
        finished: Boolean(kind.process) && mark.state === "ended",
    };
}
