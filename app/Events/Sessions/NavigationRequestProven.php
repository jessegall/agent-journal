<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\NavigationRequestEvent;

/**
 * A navigation request was proven complete.
 */
final readonly class NavigationRequestProven implements NavigationRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
