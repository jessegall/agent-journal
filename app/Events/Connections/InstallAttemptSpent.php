<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\InstallAttemptEvent;
use DateTimeImmutable;

/**
 * An install attempt's line was redeemed, and the attempt now names the binding it made.
 */
final readonly class InstallAttemptSpent extends ConnectionEvent implements InstallAttemptEvent
{
    public function __construct(
        public string $attemptId,
        public string $bindingId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
