<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\NavigationRequestEvent;

/**
 * A navigation request was abandoned for the reason given.
 */
final readonly class NavigationRequestAbandoned implements NavigationRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
