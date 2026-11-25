<?php

declare(strict_types=1);

namespace App\Commands\Terminals\RenewTerminalControl;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
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
