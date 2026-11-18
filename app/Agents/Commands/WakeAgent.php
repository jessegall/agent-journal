<?php

declare(strict_types=1);

namespace App\Agents\Commands;

use App\Agents\Handlers\WakeAgentHandler;
use App\Agents\Support\DriverReceipt;
use App\Agents\Support\StackTarget;
use App\Bus\Attributes\HandledBy;
use App\Bus\Contracts\Command;

/**
 * Wakes an agent's runtime for waiting work; a wake already open is raised instead of adding another.
 *
 * @implements Command<DriverReceipt>
 */
#[HandledBy(WakeAgentHandler::class)]
final readonly class WakeAgent implements Command
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
