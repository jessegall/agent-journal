<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request's script made progress.
 */
final readonly class DriverRequestScriptProgressed implements DriverRequestEvent, SessionEvent
{
    public function __construct(
        public string $requestId,
    ) {}
}
