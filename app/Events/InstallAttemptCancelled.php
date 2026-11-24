<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Connections\InstallAttemptEvent;
use DateTimeImmutable;

/**
 * An owner cancelled an install attempt; its line no longer redeems.
 */
final readonly class InstallAttemptCancelled extends ConnectionEvent implements InstallAttemptEvent
{
    public function __construct(
        public string $attemptId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
