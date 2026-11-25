<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\ProjectBindingEvent;
use DateTimeImmutable;

/**
 * The owner assigned a binding with no environment to an environment of its project.
 */
final readonly class ProjectBindingEnvironmentAssigned implements ConnectionEvent, ProjectBindingEvent
{
    public function __construct(
        public string $bindingId,
        public string $environmentId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
