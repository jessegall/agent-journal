<?php

declare(strict_types=1);

namespace App\Hooks\Support;

use App\Actors\Contracts\WorkStackProvider;
use App\Agents\Contracts\CurrentSession;
use App\Agents\Exceptions\AgentContextMissing;

/**
 * An agent works on the stack of the session its signed call came from; an agent acting outside a signed call has
 * none to admit.
 */
final readonly class AgentWorkStack implements WorkStackProvider
{
    public function __construct(private CurrentSession $session) {}

    /**
     * @return list<string>
     */
    public function sessionsToAdmit(): array
    {
        try {
            return [$this->session->sessionId()];
        } catch (AgentContextMissing) {
            return [];
        }
    }
}
