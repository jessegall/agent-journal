<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\ChangeAgentEffortHandler;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Changes the effort a runtime uses; a later effort replaces an earlier one that has not run.
 *
 * @implements Command<DriverReceipt>
 */
#[HandledBy(ChangeAgentEffortHandler::class)]
final readonly class ChangeAgentEffort implements Command
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $idempotencyKey,
        public string $effort,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
