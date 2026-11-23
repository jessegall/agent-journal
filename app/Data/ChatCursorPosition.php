<?php

declare(strict_types=1);

namespace App\Data;

use App\Support\ChatInterval;
use Spatie\LaravelData\Data;

/**
 * Where a chat cursor stands: the inbox and the interval it was issued for, and the sequence it reads on from.
 */
final class ChatCursorPosition extends Data
{
    public function __construct(
        public readonly string $inbox,
        public readonly string $interval,
        public readonly int $sequence,
    ) {}

    /**
     * Whether the cursor was issued for this very interval.
     */
    public function isFor(ChatInterval $interval): bool
    {
        return $this->inbox === $interval->inboxId && $this->interval === $interval->intervalId;
    }
}
