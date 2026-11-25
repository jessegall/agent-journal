<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\DriverRequestEvent;

/**
 * A driver request was cancelled.
 */
final readonly class DriverRequestCancelled implements DriverRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
