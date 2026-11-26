<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;

/**
 * A driver request was applied.
 */
final readonly class DriverRequestApplied implements DriverRequestEvent, SessionEvent
{
    public function __construct(
        public string $requestId,
    ) {}
}
