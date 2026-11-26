<?php

declare(strict_types=1);

namespace App\Terminals\Commands\SendTerminalInput;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Terminals\TerminalInput;

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
