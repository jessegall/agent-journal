export function ticking(update) {
    // @sin architecture_viewer_viewer_timer_by_hand
    return setInterval(update, 1000);
}

export function once(update) {
    // @righteous architecture_viewer_viewer_timer_by_hand
    return setTimeout(update, 1000);
}

export function askAfterWait(ask) {
    // @sin architecture_viewer_viewer_timer_by_hand
    return setTimeout(async () => {
        await ask();
        askAfterWait(ask);
    }, 1000);
}
