<?php

declare(strict_types=1);

namespace App\Agents\Commands\CloseTerminalView;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

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
