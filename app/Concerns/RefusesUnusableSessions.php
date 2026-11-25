<?php

declare(strict_types=1);

namespace App\Concerns;

use App\Exceptions\CredentialRejected;
use App\Models\Agents\AgentSession;

/**
 * Refuses a session that may no longer act: no credential, a revoked one, an ended session, a session another
 * runtime of its agent fenced off, or a retired agent.
 */
trait RefusesUnusableSessions
{
    /**
     * @throws CredentialRejected
     */
    private function assertUsableSession(AgentSession $session): void
    {
        if ($session->sessionToken === null) {
            throw CredentialRejected::unknown();
        }

        if ($session->sessionToken->isRevoked()) {
            throw CredentialRejected::revoked();
        }

        if (! $session->isActive()) {
            throw CredentialRejected::sessionEnded();
        }

        if (! $session->agent->isCurrentRuntime($session)) {
            throw CredentialRejected::fenced();
        }

        if ($session->agent->isRetired()) {
            throw CredentialRejected::agentRetired();
        }
    }
}
