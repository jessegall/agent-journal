<?php

declare(strict_types=1);

namespace App\Sessions\Commands\EndStoppedSession;

use App\Agents\Enums\AccessType;
use App\Attributes\Commands\Authorize;
use App\Bus\Contracts\AgentStackCommand;
use App\Policies\AgentPolicy;
use App\Support\Command;
use App\Values\StackTarget;

/**
 * Ends a session its stack's ready state saw stopped with no process left running, such as a headless one stopped
 * between its turns.
 *
 * @extends Command<void>
 */
#[Authorize(AgentPolicy::class, AccessType::Edit)]
final readonly class EndStoppedSessionCommand extends Command implements AgentStackCommand
{
    public function __construct(public string $agentId, public string $sessionId) {}

    public function target(): StackTarget
    {
        return new StackTarget($this->agentId, $this->sessionId);
    }
}
