<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ChangeAgentModelHandler;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Changes the model a runtime uses; a later model replaces an earlier one that has not run.
 *
 * @implements Command<DriverReceipt>
 */
#[HandledBy(ChangeAgentModelHandler::class)]
final readonly class ChangeAgentModel implements Command
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
