<?php

declare(strict_types=1);

namespace App\Commands\Sessions\ReleaseAgentHold;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\AgentStackCommand;
use App\Enums\Agents\AccessType;
use App\Enums\Drivers\HoldReason;
use App\Policies\AgentMaintenancePolicy;
use App\Support\Command;
use App\Values\StackTarget;

/**
 * A user releases the hold they read on an agent's runtime: an interrupt or a call for attention, never a hold the
 * driver itself shows.
 *
 * @extends Command<void>
 */
#[Authorize(AgentMaintenancePolicy::class, AccessType::Edit)]
final readonly class ReleaseAgentHoldCommand extends Command implements AgentStackCommand
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public HoldReason $expectedHold,
        public string $reason,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
