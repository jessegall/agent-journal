<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * An owner cancelled an install attempt; its line no longer redeems.
 */
final readonly class InstallAttemptCancelled implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $attemptId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
