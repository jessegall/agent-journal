<?php

declare(strict_types=1);

namespace App\Connections\Events;

use App\Contracts\Event;
use DateTimeImmutable;
use Illuminate\Contracts\Events\ShouldDispatchAfterCommit;

/**
 * A binding's start was recorded under the id its device chose, with the runtime it opened.
 */
final readonly class BindingStartRecorded implements Event, ShouldDispatchAfterCommit
{
    public function __construct(
        public string $bindingId,
        public string $startId,
        public string $runtimeId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
