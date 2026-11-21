<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * The owner assigned a binding with no environment to an environment of its project.
 */
final readonly class ProjectBindingEnvironmentAssigned implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $bindingId,
        public string $environmentId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
