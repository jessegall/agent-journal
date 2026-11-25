<?php

declare(strict_types=1);

namespace App\Values;

use App\Models\Agents\Agent;
use App\Support\ActorIdentity;

/**
 * The agent and journal session one stack belongs to.
 */
final readonly class StackTarget
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
    ) {}

    public function isSameAs(self $other): bool
    {
        return $this->agentId === $other->agentId && $this->sessionId === $other->sessionId;
    }

    /**
     * The agent the stack belongs to, as an actor.
     */
    public function actorIdentity(): ActorIdentity
    {
        return ActorIdentity::ofClass(Agent::class, $this->agentId);
    }

    /**
     * The stack named in words, for a message: agent 1, session 10.
     */
    public function description(): string
    {
        return "agent {$this->agentId}, session {$this->sessionId}";
    }
}
