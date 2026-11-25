<?php

declare(strict_types=1);

namespace App\Commands\Terminals\ReleaseTerminalControl;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A writer gives the input of an agent's terminal back; the host fences the grant.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class ReleaseTerminalControlCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
    ) {}
}
