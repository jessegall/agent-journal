<?php

declare(strict_types=1);

namespace App\Agents\Values;

/**
 * The session a user saw an agent run when they wrote to it: the agent, its session (none when it ran none) and that
 * session's process generation. A write against it is refused once the agent runs another.
 */
final readonly class SeenSession
{
    public function __construct(
        public string $agentId,
        public string|null $sessionId,
        public int $generation,
    ) {}
}
