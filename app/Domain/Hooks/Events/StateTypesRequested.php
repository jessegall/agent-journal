<?php

declare(strict_types=1);

namespace App\Domain\Hooks\Events;

use App\Domain\Hooks\States\StateTypeRegistry;

/**
 * Raised once per worker while the state types are built: a domain listener registers its own state types here.
 */
final readonly class StateTypesRequested
{
    public function __construct(public StateTypeRegistry $registry) {}
}
