<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Connections\Contracts\InstallAttemptEvent;
use DateTimeImmutable;

/**
 * An owner cancelled an install attempt; its line no longer redeems.
 */
final readonly class InstallAttemptCancelled implements ConnectionEvent, InstallAttemptEvent
{
    public function __construct(
        public string $attemptId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
