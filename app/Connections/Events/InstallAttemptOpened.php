<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;

/**
 * An owner opened an attempt to install a line for one target, under its public reference.
 */
final readonly class InstallAttemptOpened implements Event
{
    public function __construct(
        public string $attemptId,
        public string $reference,
        public DateTimeImmutable $occurredAt,
    ) {}
}
