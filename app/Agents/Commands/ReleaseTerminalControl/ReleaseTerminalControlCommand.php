<?php

declare(strict_types=1);

namespace App\Agents\Commands\ReleaseTerminalControl;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

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
