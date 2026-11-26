<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;

/**
 * The host could not carry a driver request out at all.
 */
final readonly class DriverRequestMarkedUnavailable implements DriverRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
