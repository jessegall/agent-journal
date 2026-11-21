<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A project folder on a machine was joined to a project through that machine's host. It carries ids only, never
 * the folder's path.
 */
final readonly class ProjectBindingCreated implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $bindingId,
        public string $projectId,
        public string $hostId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
