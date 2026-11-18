<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Actions\LaunchCredentials;
use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Models\AgentSession;
use App\Agents\Models\LaunchCredential;

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

        if ($credential->session->agent->isRetired()) {
            throw CredentialRejected::agentRetired();
        }

        return $credential->session;
    }
}
