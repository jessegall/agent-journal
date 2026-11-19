import type { ScreenFrameData } from '@generated/types/core';

/**
 * Whether a frame should replace the one drawn: a new host process starts afresh, and a late frame is ignored.
 */
export function supersedes(next: ScreenFrameData, drawn: ScreenFrameData | null): boolean {
    return drawn === null || next.epoch !== drawn.epoch || next.sequence > drawn.sequence;
}
