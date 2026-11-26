<?php

declare(strict_types=1);

namespace App\Agents\Commands\CheckStartStatus;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\AgentStackCommand;
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
