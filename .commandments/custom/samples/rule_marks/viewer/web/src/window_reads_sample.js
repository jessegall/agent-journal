export async function readsByItself(context) {
    // @sin architecture_viewer_window_reads_outside_its_api
    return context.read("task list");
}

export function rowsByItself(useRows) {
    // @sin architecture_viewer_window_reads_outside_its_api
    return useRows("task list", ["task.*"]);
}

export function readsThroughItsProps(window) {
    // @righteous architecture_viewer_window_reads_outside_its_api
    return window.reload("tasks");
}
