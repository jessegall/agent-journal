<?php

declare(strict_types=1);

namespace App\Hooks\Events;

use App\Contracts\Event;
use App\Hooks\Contracts\StateRegistration;

/**
 * Raised once per worker while the state types are built: a domain listener registers its own state types here, at
 * once, through the narrow registration it is handed.
 */
final readonly class StateTypesRequested implements Event
{
    public function __construct(public StateRegistration $registry) {}
}
