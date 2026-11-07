// A shimmer starts at the page's clock, not at the moment its skeleton is drawn: every shimmer of one length shows the same
// phase, so a skeleton drawn while others run joins them and a redraw at a switch does not restart the sweep.
// The delay is negative: the animation begins already `now % length` into its run. Set it once when the skeleton is made,
// since a later change of the delay would move the phase.
export function shimmerStyle(lengthMs, nowMs = performance.now()) {
    return {"--shimmer-ms": `${lengthMs}ms`, animationDelay: `${-(nowMs % lengthMs)}ms`};
}
