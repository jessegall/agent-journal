<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Contracts\Drivers\NavigationRequestEvent;

/**
 * The proof a navigation request was given was refused.
 */
final readonly class NavigationRequestProofRefused implements NavigationRequestEvent, SessionEvent
{
    public function __construct(public string $requestId) {}
}
