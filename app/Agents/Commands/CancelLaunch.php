<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\TargetsAgentStack;
use App\Agents\Enums\AgentAbility;
use App\Agents\Handlers\CancelLaunchHandler;
use App\Agents\Models\Agent;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Attributes\Operation;
use App\Bus\Contracts\AuthorizedCommand;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;
use App\Operations\Enums\ResourceAreaType;

/**
 * Cancels the work a started agent was launched for: its runtime, when one opened, is told to stop, its workspace
 * stays, and the owner of the work hears that it was cancelled once the stop is recorded.
 *
 * @extends Command<bool>
 */
#[HandledBy(CancelLaunchHandler::class)]
#[Authorize(AgentPolicy::class, AgentAbility::Work)]
#[Operation('cancel_launch', ResourceAreaType::JournalWork, AccessType::Edit)]
final readonly class CancelLaunch extends Command implements AuthorizedCommand, TargetsAgentStack
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
