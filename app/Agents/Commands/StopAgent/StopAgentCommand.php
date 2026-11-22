<?php

declare(strict_types=1);

namespace App\Agents\Commands\StopAgent;

use App\Agents\Contracts\AgentStackCommand;
use App\Agents\Policies\AgentPolicy;
use App\Agents\Values\DriverReceipt;
use App\Agents\Values\StackTarget;
use App\Bus\Attributes\Authorize;
use App\Bus\Support\Command;
use App\Operations\Enums\AccessType;

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
