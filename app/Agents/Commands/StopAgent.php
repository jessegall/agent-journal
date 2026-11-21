<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Contracts\AgentStackCommand;
use App\Agents\Handlers\StopAgentHandler;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Values\DriverReceipt;
use App\Agents\Values\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Attributes\HandledBy;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

/**
 * Stops an agent's runtime: it takes no more requests from now on.
 *
 * @extends Command<DriverReceipt>
 */
#[HandledBy(StopAgentHandler::class)]
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class StopAgent extends Command implements AgentStackCommand
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
