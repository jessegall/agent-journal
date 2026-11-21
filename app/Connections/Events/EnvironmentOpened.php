<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A connected project gained an environment its bindings can work in.
 */
final readonly class EnvironmentOpened implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $environmentId,
        public string $projectId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
