<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Enums\HoldReason;
use App\Agents\Handlers\ReleaseAgentHoldHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;

/**
 * A person releases the hold they read on an agent's runtime: an interrupt or a call for attention, never a hold the
 * program itself shows.
 *
 * @implements Command<void>
 */
#[HandledBy(ReleaseAgentHoldHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Recover)]
final readonly class ReleaseAgentHold implements Command, HasAuthorizationSubject
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
