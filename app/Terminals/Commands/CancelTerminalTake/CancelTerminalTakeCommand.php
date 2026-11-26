<?php

declare(strict_types=1);

namespace App\Terminals\Commands\CancelTerminalTake;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A writer cancels their take: a take on its way never issues a grant, and a grant it issued is released.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class CancelTerminalTakeCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $takeId,
    ) {}
}
