<?php

declare(strict_types=1);

namespace App\Agents;

use App\Agents\Concerns\RefusesUnusableSessions;
use App\Exceptions\CredentialRejected;
use App\Models\Agents\AgentSession;
use App\Sessions\SessionTokens;

/**
 * The one named read that finds a session from a token, before any query scoped to an agent can run.
 */
final readonly class CredentialLookup
{
    use RefusesUnusableSessions;

    public function sessionFor(string $token): AgentSession
    {
        $session = AgentSession::query()->withSessionTokenAndAgent()
            ->withSessionTokenHash(SessionTokens::hashOf($token))
            ->first();

        if ($session === null) {
            throw CredentialRejected::unknown();
        }

        $this->assertUsableSession($session);

        return $session;
    }
}
