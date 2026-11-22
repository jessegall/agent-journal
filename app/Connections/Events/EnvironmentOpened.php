<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;

/**
 * A connected project gained an environment its bindings can work in.
 */
final readonly class EnvironmentOpened implements Event
{
    public function __construct(
        public string $environmentId,
        public string $projectId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
