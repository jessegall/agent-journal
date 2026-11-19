<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Data\ScreenFrameData;
use Carbon\CarbonImmutable;

/**
 * A runtime's latest screen frame and when the journal received it.
 */
final readonly class ReceivedScreen
{
    public function __construct(
        public ScreenFrameData $frame,
        public CarbonImmutable $receivedAt,
    ) {}

    /**
     * Whether this frame is newer than the one a viewer holds: from another host process, or later in the same one.
     */
    public function isNewerThan(string $epoch, int $sequence): bool
    {
        return $this->frame->epoch !== $epoch || $this->frame->sequence > $sequence;
    }
}
