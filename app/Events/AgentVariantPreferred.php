<?php

declare(strict_types=1);

namespace App\Events;

use App\Enums\DriverVariant;

/**
 * An agent's launches use this variant from now on when they name none.
 */
final readonly class AgentVariantPreferred extends SessionEvent
{
    public function __construct(
        public string $agentId,
        public DriverVariant $variant,
    ) {}
}
