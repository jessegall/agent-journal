<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\NavigationRequestEvent;

/**
 * A navigation request was cancelled.
 */
final readonly class NavigationRequestCancelled implements NavigationRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
