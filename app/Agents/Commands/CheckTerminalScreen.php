<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Data\TerminalControlData;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A writer asks the host to look at the screen again, as after an uncertain write; nothing is written.
 *
 * @extends Command<TerminalControlData>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class CheckTerminalScreen extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
    ) {}
}
