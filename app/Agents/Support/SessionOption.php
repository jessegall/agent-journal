<?php

declare(strict_types=1);

namespace App\Agents\Support;

/**
 * A running agent session someone may talk to: the session, its agent's display name and the stack it targets.
 */
final readonly class SessionOption
{
    public function __construct(
        public string $sessionId,
        public string $agentName,
        public StackTarget $target,
    ) {}
}
