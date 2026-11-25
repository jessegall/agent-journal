<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\NavigationRequestEvent;

/**
 * A navigation request was cancelled.
 */
final readonly class NavigationRequestCancelled extends SessionEvent implements NavigationRequestEvent
{
    public function __construct(public string $requestId) {}
}
