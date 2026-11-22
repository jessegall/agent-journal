<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use DateTimeImmutable;

/**
 * A project was connected from another machine and recorded under its key. Raised after the transaction committed.
 */
final readonly class ProjectCreated implements Event
{
    public function __construct(
        public string $projectId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
