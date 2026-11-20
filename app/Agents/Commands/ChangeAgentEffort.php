<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\TargetsAgentStack;
use App\Agents\Handlers\ChangeAgentEffortHandler;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Changes the effort a runtime uses; a later effort replaces an earlier one that has not run.
 *
 * @extends Command<DriverReceipt>
 */
#[HandledBy(ChangeAgentEffortHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class ChangeAgentEffort extends Command implements TargetsAgentStack
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $idempotencyKey,
        public string $effort,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
