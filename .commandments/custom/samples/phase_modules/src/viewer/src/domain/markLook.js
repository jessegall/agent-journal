export function worded(mark, kind) {
    return {
        // @sin architecture_viewer_event_mark_ends_with_a_tick
        ended: mark.state === "ended",
        // @righteous architecture_viewer_event_mark_ends_with_a_tick
        finished: Boolean(kind.process) && mark.state === "ended",
    };
}
