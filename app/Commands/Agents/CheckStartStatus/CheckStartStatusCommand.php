<?php

declare(strict_types=1);

namespace App\Commands\Agents\CheckStartStatus;

use App\Attributes\Authorize;
use App\Contracts\Bus\AgentStackCommand;
use App\Enums\Agents\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\StackTarget;

/**
 * The owner asks the host to send again the ready report of a start whose conversation is not verified yet.
 *
 * @extends Command<bool>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class CheckStartStatusCommand extends Command implements AgentStackCommand
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
}
