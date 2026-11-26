<?php

declare(strict_types=1);

namespace App\Connections\Contracts;

use App\Contracts\Events\Event;
use DateTimeImmutable;

/**
 * A step of an attempt to install the journal into a project.
 */
interface InstallAttemptEvent extends Event
{
    public string $attemptId { get; }

    public DateTimeImmutable $occurredAt { get; }
}
