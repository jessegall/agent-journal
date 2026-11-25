<?php

declare(strict_types=1);

namespace App\Commands\Terminals\SendTerminalInput;

use App\Attributes\Authorize;
use App\Enums\Agents\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Support\TerminalInput;

/**
 * A writer sends text or Enter through their grant, at its sequence and for the screen revision they saw.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class SendTerminalInputCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $grantId,
        public TerminalInput $input,
    ) {}
}
