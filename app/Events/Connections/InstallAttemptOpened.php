<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\InstallAttemptEvent;
use DateTimeImmutable;

/**
 * An owner opened an attempt to install a line for one target, under its public reference.
 */
final readonly class InstallAttemptOpened implements ConnectionEvent, InstallAttemptEvent
{
    public function __construct(
        public string $attemptId,
        public string $reference,
        public DateTimeImmutable $occurredAt,
    ) {}
}
