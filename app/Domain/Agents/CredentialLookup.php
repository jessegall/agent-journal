<?php

declare(strict_types=1);

namespace App\Domain\Agents;

use App\Domain\Agents\Models\AgentSession;
use App\Domain\Agents\Models\LaunchCredential;

/**
 * The one named read that finds a session from a token, before any query scoped to an agent can run.
 */
final readonly class CredentialLookup
{
    public function sessionFor(string $token): AgentSession
    {
        $credential = LaunchCredential::query()->with('session.agent')->where('token_hash', LaunchCredentials::hashOf($token))->first();

        if ($credential === null) {
            throw CredentialRejected::unknown();
        }

        if ($credential->isRevoked()) {
            throw CredentialRejected::revoked();
        }

        if (! $credential->session->isActive()) {
            throw CredentialRejected::sessionEnded();
        }

        return $credential->session;
    }
}
