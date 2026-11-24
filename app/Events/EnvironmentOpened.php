<?php

declare(strict_types=1);

namespace App\Events;

use DateTimeImmutable;

/**
 * A connected project gained an environment its bindings can work in.
 */
final readonly class EnvironmentOpened extends ConnectionEvent
{
    public function __construct(
        public string $environmentId,
        public string $projectId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
