<?php

declare(strict_types=1);

namespace App\Events\Connections;

use App\Contracts\Connections\ProjectBindingEvent;
use DateTimeImmutable;

/**
 * A project folder on a machine was joined to a project through that machine's host. It carries ids only, never
 * the folder's path.
 */
final readonly class ProjectBindingCreated extends ConnectionEvent implements ProjectBindingEvent
{
    public function __construct(
        public string $bindingId,
        public string $projectId,
        public string $hostId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
