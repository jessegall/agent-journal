<?php

declare(strict_types=1);

namespace App\Commands\Terminals\RenewTerminalView;

use App\Attributes\Commands\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A viewer keeps watching an agent's terminal through one read interest: its lease goes on, and an ended one is
 * refused rather than opened anew.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class RenewTerminalViewCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $readInterestId,
    ) {}
}
