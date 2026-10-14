// Intro and outro frames are not part of a held loop.
export function frameIn(clip, index, closing = null) {
    if (!clip.loops) return Math.min(index, clip.frames - 1);
    const intro = clip.intro || 0;
    const outro = clip.outro || 0;
    if (closing !== null && index >= closing) return Math.min(clip.frames - outro + index - closing, clip.frames - 1);
    return index < intro ? index : intro + ((index - intro) % (clip.frames - intro - outro));
}

// Close at a resting page, not halfway through a turn.
export function closeAt(clip, index) {
    const intro = clip.intro || 0;
    const unit = clip.leaves || clip.frames - intro - (clip.outro || 0);
    return intro + Math.ceil(Math.max(index - intro, 0) / unit) * unit;
}

// Whether the clip on screen gives way to another that is wanted: at once when it is interruptible (figure.js CLIPS), else once it has played
// out, between the frame it was at when last drawn, `last`, and the frame it is at now, `index`
export function canSwitch(clip, index, last) {
    if (clip.interruptible) return true;
    if (!clip.loops) return index >= clip.frames;
    const unit = clip.leaves || clip.frames;
    return Math.floor(index / unit) > Math.floor(last / unit);
}
