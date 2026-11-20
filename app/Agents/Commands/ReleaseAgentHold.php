<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Bus\Attributes\Operation;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;
use App\Agents\Contracts\TargetsAgentStack;
use App\Agents\Enums\AgentAbility;
use App\Agents\Enums\HoldReason;
use App\Agents\Handlers\ReleaseAgentHoldHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\HasAuthorizationSubject;
use App\Bus\Support\Command;

/**
 * A person releases the hold they read on an agent's runtime: an interrupt or a call for attention, never a hold the
 * program itself shows.
 *
 * @extends Command<void>
 */
#[HandledBy(ReleaseAgentHoldHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
#[Operation('release_agent_hold', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class ReleaseAgentHold extends Command implements HasAuthorizationSubject, TargetsAgentStack
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

    /**
     * @return class-string
     */
    public function subject(): string
    {
        return Agent::class;
    }
}
