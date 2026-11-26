<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;

/**
 * The host refused to wake a driver request.
 */
final readonly class DriverRequestRefusalRecorded implements DriverRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
