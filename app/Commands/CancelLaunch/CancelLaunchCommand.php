<?php

declare(strict_types=1);

namespace App\Commands\CancelLaunch;

use App\Attributes\Authorize;
use App\Contracts\Bus\AgentStackCommand;
use App\Enums\AccessType;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\StackTarget;

/**
 * Cancels the work a started agent was launched for: its runtime, when one opened, is told to stop, its workspace
 * stays, and the owner of the work hears that it was cancelled once the stop is recorded.
 *
 * @extends Command<bool>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class CancelLaunchCommand extends Command implements AgentStackCommand
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
