<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * Whether a driver request was carried out is no longer known.
 */
final readonly class DriverRequestMarkedUncertain extends SessionEvent implements DriverRequestEvent
{
    public function __construct(public string $requestId) {}
}
