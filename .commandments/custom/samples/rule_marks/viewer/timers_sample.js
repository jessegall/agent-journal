export function ticking(update) {
    // @sin architecture_viewer_NoTimerOutsideClocksDetector
    return setInterval(update, 1000);
}

export function once(update) {
    // @righteous architecture_viewer_NoTimerOutsideClocksDetector
    return setTimeout(update, 1000);
}
