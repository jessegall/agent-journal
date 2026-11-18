<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\DeliverAgentHandler;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Delivers content to an agent's runtime, in order behind its earlier requests.
 *
 * @implements Command<DriverReceipt>
 */
#[HandledBy(DeliverAgentHandler::class)]
final readonly class DeliverAgent implements Command
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
        public string $idempotencyKey,
        public string $message,
    ) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
