<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\WakeAgentHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;
use App\Bus\Contracts\HasAuthorizationSubject;

/**
 * Wakes an agent's runtime for waiting work; a wake already open is raised instead of adding another.
 *
 * @implements Command<DriverReceipt>
 */
#[HandledBy(WakeAgentHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
final readonly class WakeAgent implements Command, HasAuthorizationSubject
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $idempotencyKey,
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
