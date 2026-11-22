<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Event;
use DateTimeImmutable;

/**
 * An owner cancelled an install attempt; its line no longer redeems.
 */
final readonly class InstallAttemptCancelled implements Event
{
    public function __construct(
        public string $attemptId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
