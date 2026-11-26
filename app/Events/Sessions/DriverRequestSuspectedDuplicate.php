<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;

/**
 * A driver request may duplicate an earlier one.
 */
final readonly class DriverRequestSuspectedDuplicate implements DriverRequestEvent, SessionEvent
{
    public function __construct(
        public string $requestId,
        public string $originalId,
    ) {}
}
