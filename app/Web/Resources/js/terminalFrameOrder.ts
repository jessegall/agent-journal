import type { ScreenFrameData } from '@generated/types/core';

/**
 * Whether a frame should replace the one drawn: only a later frame of the same host process and stream. A frame of
 * another process or stream belongs to another read and needs a fresh open first.
 */
export function supersedes(
    next: ScreenFrameData,
    drawn: ScreenFrameData | null,
): boolean {
    return (
        drawn === null ||
        (next.epoch === drawn.epoch &&
            next.stream === drawn.stream &&
            next.sequence > drawn.sequence)
    );
}
