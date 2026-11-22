<?php

declare(strict_types=1);

namespace App\Agents\Commands\CheckTerminalScreen;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A writer asks the host to look at the screen again, as after an uncertain write; nothing is written.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class CheckTerminalScreenCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
    ) {}
}
