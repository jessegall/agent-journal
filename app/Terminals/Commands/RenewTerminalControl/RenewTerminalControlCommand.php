<?php

declare(strict_types=1);

namespace App\Terminals\Commands\RenewTerminalControl;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A writer keeps their control of an agent's terminal for another lifetime; control is checked again.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class RenewTerminalControlCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
    ) {}
}
