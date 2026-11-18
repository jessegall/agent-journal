<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * The agent and journal session one stack belongs to.
 */
final readonly class StackTarget
{
    public function __construct(
        public string $agentId,
        public string $sessionId,
    ) {}

    /**
     * The stack named in words, for a message: agent 1, session 10.
     */
    public function description(): string
    {
        return "agent {$this->agentId}, session {$this->sessionId}";
    }
}
