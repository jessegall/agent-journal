<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Agents\Support\TerminalInput;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A writer sends text or Enter through their grant, at its sequence and for the screen revision they saw.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class SendTerminalInput extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
        public TerminalInput $input,
    ) {}
}
