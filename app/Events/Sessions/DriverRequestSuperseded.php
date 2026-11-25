<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A newer driver request took the place of this one.
 */
final readonly class DriverRequestSuperseded implements DriverRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
