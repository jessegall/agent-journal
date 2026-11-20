<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Actions\StartTokens;
use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Models\AgentSession;
use App\Agents\Support\Concerns\RefusesUnusableSessions;
use Illuminate\Database\Eloquent\Builder;

/**
 * The one named read that finds a session from a token, before any query scoped to an agent can run.
 */
final readonly class CredentialLookup
{
    use RefusesUnusableSessions;

    public function sessionFor(string $token): AgentSession
    {
        $session = AgentSession::query()->with(['startToken', 'agent'])
            ->whereHas(
                'startToken',
                fn (Builder $startToken) => $startToken->where('token_hash', StartTokens::hashOf($token)),
            )
            ->first();

        if ($session === null) {
            throw CredentialRejected::unknown();
        }

        $this->assertUsableSession($session);

        return $session;
    }
}
