export function faceBySniffing() {
    // @sin architecture_viewer_FaceChosenBySessionDetector
    return /iPhone/.test(navigator.userAgent) ? "phone" : "person";
}

export function faceByAddress() {
    // @sin architecture_viewer_FaceChosenBySessionDetector
    return location.pathname.startsWith("/p/") ? "phone" : "person";
}

export function faceBySession(answer, width) {
    // @righteous architecture_viewer_FaceChosenBySessionDetector
    return answer.type === "phone" || width < 700 ? "phone" : "person";
}
