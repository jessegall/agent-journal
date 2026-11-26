<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Exceptions\CredentialRejected;
use App\Models\Agents\AgentSession;
use App\Models\Sessions\SessionToken;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

/**
 * Issues and revokes the credential of a start. The token is handed out once and only its hash is stored.
 */
final readonly class SessionTokens
{
    /**
     * @return string the token, which the journal never shows or stores again
     */
    public function issue(AgentSession $session): string
    {
        $token = Str::random(64);
        new SessionToken()->issueFor($session, self::hashOf($token));

        return $token;
    }

    /**
     * A new token for the session in place of its old one, after the old process is proven stopped.
     *
     * @return string the token, which the journal never shows or stores again
     */
    public function rotate(AgentSession $session): string
    {
        $token = Str::random(64);
        $credential = $session->loadMissing('sessionToken')->sessionToken ?? throw CredentialRejected::unknown();
        $credential->rotateTo(self::hashOf($token));

        return $token;
    }

    public function revoke(AgentSession $session): void
    {
        $credential = $session->loadMissing('sessionToken')->sessionToken ?? throw CredentialRejected::unknown();
        $credential->revokeAt(CarbonImmutable::now());
    }

    public static function hashOf(string $token): string
    {
        return hash('sha256', $token);
    }
}
