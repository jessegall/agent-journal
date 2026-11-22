<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Data\TerminalInterestData;
use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A viewer keeps watching an agent's terminal through one read interest: its lease goes on, and an ended one is
 * refused rather than opened anew.
 *
 * @extends Command<TerminalInterestData>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class RenewTerminalView extends Command
{
    public function __construct(
        public string $agentId,
        public string $readInterestId,
    ) {}
}
