<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\NavigationRequestEvent;

/**
 * A navigation request answered its screen.
 */
final readonly class NavigationRequestAnswered extends SessionEvent implements NavigationRequestEvent
{
    public function __construct(public string $requestId) {}
}
