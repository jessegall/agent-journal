<?php

declare(strict_types=1);

namespace App\Events\Sessions;

use App\Enums\Drivers\DriverType;

/**
 * An agent's starts use this driver type from now on when they name none.
 */
final readonly class AgentDriverTypePreferred implements SessionEvent
{
    public function __construct(
        public string $agentId,
        public DriverType $driverType,
    ) {}
}
