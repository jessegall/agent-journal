<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Data\ScreenFrameData;
use Carbon\CarbonImmutable;

/**
 * A runtime's latest screen frame, the identity it was admitted under and when the journal received it.
 */
final readonly class ReceivedScreen
{
    public function __construct(
        public ScreenFrameData $frame,
        public ScreenIdentity $identity,
        public CarbonImmutable $receivedAt,
    ) {}

    /**
     * Whether this frame is newer than the one a viewer holds: of another host process or stream, or later in the same
     * stream.
     */
    public function isNewerThan(string $epoch, string $stream, int $sequence): bool
    {
        return $this->identity->streamName() !== "{$epoch}/{$stream}" || $this->frame->sequence > $sequence;
    }

    /**
     * How many milliseconds the frame's liveness proof has left at the given time, by the server's clock, none left
     * once it expired; null for an older host, which sends no proof.
     */
    public function liveForMs(CarbonImmutable $now): int|null
    {
        if ($this->frame->expiresAt === null) {
            return null;
        }

        return max(0, (int) $now->diffInMilliseconds(CarbonImmutable::parse($this->frame->expiresAt), false));
    }
}
