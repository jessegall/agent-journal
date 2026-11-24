<?php

declare(strict_types=1);

namespace App\Commands\Terminals\CloseTerminalView;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A viewer stops watching an agent's terminal through one read interest; the viewer's other interests and other
 * viewers' stay.
 *
 * @extends Command<void>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class CloseTerminalViewCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $readInterestId,
    ) {}
}
