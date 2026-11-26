<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;

/**
 * A driver request was staged for its host.
 */
final readonly class DriverRequestStaged implements DriverRequestEvent, SessionEvent
{
    public function __construct(
        public string $requestId,
    ) {}
}
