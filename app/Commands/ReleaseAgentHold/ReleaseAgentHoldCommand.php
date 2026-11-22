<?php

declare(strict_types=1);

namespace App\Commands\ReleaseAgentHold;

use App\Attributes\Authorize;
use App\Contracts\AgentStackCommand;
use App\Enums\AccessType;
use App\Enums\HoldReason;
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
