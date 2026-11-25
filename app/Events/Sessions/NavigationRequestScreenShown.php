<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\NavigationRequestEvent;

/**
 * A navigation request reached a screen of the driver.
 */
final readonly class NavigationRequestScreenShown extends SessionEvent implements NavigationRequestEvent
{
    public function __construct(public string $requestId) {}
}
