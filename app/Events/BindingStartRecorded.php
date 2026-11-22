<?php

declare(strict_types=1);

namespace App\Events;

use App\Contracts\Events\Event;
use DateTimeImmutable;

/**
 * A binding's start was recorded under the id its device chose, with the runtime it opened.
 */
final readonly class BindingStartRecorded implements Event
{
    public function __construct(
        public string $bindingId,
        public string $startId,
        public string $runtimeId,
        public DateTimeImmutable $occurredAt,
    ) {}
}
