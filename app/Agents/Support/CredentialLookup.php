<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Actions\LaunchCredentials;
use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Models\AgentSession;
use Illuminate\Database\Eloquent\Builder;

/**
 * The one named read that finds a session from a token, before any query scoped to an agent can run.
 */
final readonly class CredentialLookup
{
    public function sessionFor(string $token): AgentSession
    {
        $session = AgentSession::query()->with(['credential', 'agent'])
            ->whereHas(
                'credential',
                fn (Builder $credential) => $credential->where('token_hash', LaunchCredentials::hashOf($token)),
            )
            ->first();

        if ($session === null) {
            throw CredentialRejected::unknown();
        }

        $session->requireUsable();

        return $session;
    }
}
