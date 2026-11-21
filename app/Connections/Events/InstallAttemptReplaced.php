<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * An install attempt moved to its next version: its line was issued anew, the one before revoked.
 */
final readonly class InstallAttemptReplaced implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $attemptId,
        public int $version,
        public DateTimeImmutable $occurredAt,
    ) {}
}
