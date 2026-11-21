<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * An install attempt's line was redeemed, and the attempt now names the binding it made.
 */
final readonly class InstallAttemptSpent implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $attemptId,
        public string $bindingId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
