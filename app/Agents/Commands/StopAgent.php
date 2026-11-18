<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\StopAgentHandler;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Stops an agent's runtime: it takes no more requests from now on.
 *
 * @implements Command<DriverReceipt>
 */
#[HandledBy(StopAgentHandler::class)]
final readonly class StopAgent implements Command
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
