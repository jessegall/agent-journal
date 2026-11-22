<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A writer cancels their take: a take on its way never issues a grant, and a grant it issued is released.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class CancelTerminalTake extends Command
{
    public function __construct(
        public string $agentId,
        public string $takeId,
    ) {}
}
