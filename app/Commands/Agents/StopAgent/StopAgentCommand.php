<?php

declare(strict_types=1);

namespace App\Commands\Agents\StopAgent;

use App\Attributes\Commands\Authorize;
use App\Contracts\Bus\AgentStackCommand;
use App\Enums\Agents\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\DriverReceipt;
use App\Values\StackTarget;

/**
 * Stops an agent's runtime: it takes no more requests from now on. Bound to the process generation the caller saw,
 * it is refused when another one runs now; stops of the same session and generation converge on one request.
 *
 * @extends Command<DriverReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class StopAgentCommand extends Command implements AgentStackCommand
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $idempotencyKey,
        public int|null $expectedGeneration = null,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
