export const OVERLAY_LAYER_ID = 'overlay-layer';

/**
 * Where an overlay mounts: the shell's overlay layer when the page sits in the shell, else the body.
 */
export function overlayTarget(): string {
    return document.getElementById(OVERLAY_LAYER_ID) === null ? 'body' : `#${OVERLAY_LAYER_ID}`;
}
