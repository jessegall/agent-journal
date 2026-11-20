<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Contracts\TargetsAgentStack;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\ChangeAgentEffortHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * Changes the effort a runtime uses; a later effort replaces an earlier one that has not run.
 *
 * @extends Command<DriverReceipt>
 */
#[HandledBy(ChangeAgentEffortHandler::class)]
#[Operation('change_agent_effort', ResourceAreaType::JournalWork, AccessType::Edit)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
final readonly class ChangeAgentEffort extends Command implements HasAuthorizationSubject, TargetsAgentStack
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

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
