<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use DateTimeImmutable;

/**
 * An install attempt moved to its next version: its line was issued anew, the one before revoked.
 */
final readonly class InstallAttemptReplaced implements Event
{
    public function __construct(
        public string $attemptId,
        public int $version,
        public DateTimeImmutable $occurredAt,
    ) {}
}
