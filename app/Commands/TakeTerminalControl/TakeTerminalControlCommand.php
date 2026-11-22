<?php

declare(strict_types=1);

namespace App\Commands\TakeTerminalControl;

use App\Attributes\Authorize;
use App\Enums\AccessType;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;

/**
 * A viewer takes control of an agent's terminal through their read interest: the host's input gate gives them a
 * grant that holds the input across prompts until it is released, cancelled, expires or a local key takes it back.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class TakeTerminalControlCommand extends Command
{
    public function __construct(
        public string $agentId,
        public string $readInterestId,
        public string $takeId,
    ) {}
}
