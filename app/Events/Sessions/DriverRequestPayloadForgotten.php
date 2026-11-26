<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\DriverRequestEvent;

/**
 * A driver request let go of its payload.
 */
final readonly class DriverRequestPayloadForgotten implements DriverRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
