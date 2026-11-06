import {useWindow} from "@journal/window-kit";

export async function load() {
    // @righteous architecture_viewer_window_data_outside_context
    const answer = await useWindow().read("task list");
    // @sin architecture_viewer_window_data_outside_context
    // @sin architecture_viewer_request_outside_the_funnel
    const direct = await fetch("/api/line");
    return [answer, direct];
}
