export function faceBySniffing() {
    // @sin architecture_viewer_face_chosen_by_browser_or_path
    return /iPhone/.test(navigator.userAgent) ? "phone" : "person";
}

export function faceByAddress() {
    // @sin architecture_viewer_face_chosen_by_browser_or_path
    return location.pathname.startsWith("/p/") ? "phone" : "person";
}

export function faceBySession(answer, width) {
    // @righteous architecture_viewer_face_chosen_by_browser_or_path
    return answer.type === "phone" || width < 700 ? "phone" : "person";
}
