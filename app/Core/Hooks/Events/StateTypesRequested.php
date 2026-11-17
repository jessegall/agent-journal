<?php

declare(strict_types=1);

namespace App\Core\Hooks\Events;

use App\Core\Hooks\Contracts\StateRegistration;

/**
 * Raised once per worker while the state types are built: a domain listener registers its own state types here, at
 * once, through the narrow registration it is handed.
 */
final readonly class StateTypesRequested
{
    public function __construct(public StateRegistration $registry) {}
}
