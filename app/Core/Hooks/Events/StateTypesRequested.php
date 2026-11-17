<?php

declare(strict_types=1);

namespace App\Core\Hooks\Events;

use App\Core\Hooks\States\StateTypeRegistry;

/**
 * Raised once per worker while the state types are built: a domain listener registers its own state types here.
 */
final readonly class StateTypesRequested
{
    public function __construct(public StateTypeRegistry $registry) {}
}
