<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * The host refused to wake a driver request.
 */
final readonly class DriverRequestRefusalRecorded extends SessionEvent implements DriverRequestEvent
{
    public function __construct(public string $requestId) {}
}
