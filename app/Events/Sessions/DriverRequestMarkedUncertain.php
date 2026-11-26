<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;

/**
 * Whether a driver request was carried out is no longer known.
 */
final readonly class DriverRequestMarkedUncertain implements DriverRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
