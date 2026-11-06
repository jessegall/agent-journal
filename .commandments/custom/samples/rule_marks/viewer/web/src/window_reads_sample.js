export async function readsByItself(context) {
    // @sin architecture_viewer_window_reads_outside_its_api
    return context.read("task list");
}

export function rowsByItself(useRows) {
    // @sin architecture_viewer_window_reads_outside_its_api
    return useRows("task list", ["task.*"]);
}

export function readsThroughItsApi(api) {
    // @righteous architecture_viewer_window_reads_outside_its_api
    return api.reload(["tasks"]);
}
