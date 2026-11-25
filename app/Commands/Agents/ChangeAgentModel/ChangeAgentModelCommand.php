<?php

declare(strict_types=1);

namespace App\Commands\Agents\ChangeAgentModel;

use App\Attributes\Authorize;
use App\Contracts\Bus\AgentStackCommand;
use App\Enums\Agents\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\DriverReceipt;
use App\Values\StackTarget;

/**
 * Changes the model a runtime uses; a later model replaces an earlier one that has not run.
 *
 * @extends Command<DriverReceipt>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class ChangeAgentModelCommand extends Command implements AgentStackCommand
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $idempotencyKey,
        public string $model,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
