<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Enums\DriverType;

/**
 * An agent's launches use this driver type from now on when they name none.
 */
final readonly class AgentDriverTypePreferred extends SessionEvent
{
    public function __construct(
        public string $agentId,
        public DriverType $driverType,
    ) {}
}
