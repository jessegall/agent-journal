<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Agents\Drivers\Contracts\NavigationRequestEvent;

/**
 * A navigation request reached a screen of the driver.
 */
final readonly class NavigationRequestScreenShown implements NavigationRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
