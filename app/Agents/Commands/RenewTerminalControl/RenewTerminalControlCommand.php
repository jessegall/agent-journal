<?php

declare(strict_types=1);

namespace App\Agents\Commands\RenewTerminalControl;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

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
