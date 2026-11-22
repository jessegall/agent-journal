<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Policies\AgentMaintenancePolicy;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * A viewer takes control of an agent's terminal through their read interest: the host's input gate gives them a
 * grant that holds the input across prompts until it is released, cancelled, expires or a local key takes it back.
 *
 * @extends Command<string>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Read)]
final readonly class TakeTerminalControl extends Command
{
    public function __construct(
        public string $agentId,
        public string $readInterestId,
        public string $takeId,
    ) {}
}
