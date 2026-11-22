<?php

declare(strict_types=1);

namespace App\Commands\CheckTerminalScreen;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

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
