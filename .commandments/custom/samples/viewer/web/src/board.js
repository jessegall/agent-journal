import {useWindow} from "@journal/window-kit";

export async function load() {
    // @righteous architecture_viewer_WindowDataThroughContextDetector
    const answer = await useWindow().read("task list");
    // @sin architecture_viewer_WindowDataThroughContextDetector
    const direct = await fetch("/api/line");
    return [answer, direct];
}
