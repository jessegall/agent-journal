<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\NavigationRequestEvent;

/**
 * A navigation request was interrupted.
 */
final readonly class NavigationRequestInterrupted implements NavigationRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
