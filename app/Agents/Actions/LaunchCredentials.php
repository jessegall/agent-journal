<?php

declare(strict_types=1);

namespace App\Agents\Actions;

use App\Agents\Exceptions\CredentialRejected;
use App\Agents\Models\AgentSession;
use App\Agents\Models\LaunchCredential;
use Carbon\CarbonImmutable;
use Illuminate\Support\Str;

/**
 * Issues and revokes the credential of a launch. The token is handed out once and only its hash is stored.
 */
final readonly class LaunchCredentials
{
    /**
     * @return string the token, which the journal never shows or stores again
     */
    public function issue(AgentSession $session): string
    {
        $token = Str::random(64);
        new LaunchCredential()->issueFor($session, self::hashOf($token));

        return $token;
    }

    public function revoke(AgentSession $session): void
    {
        $credential = $session->loadMissing('credential')->credential ?? throw CredentialRejected::unknown();
        $credential->revokeAt(CarbonImmutable::now());
    }

    public static function hashOf(string $token): string
    {
        return hash('sha256', $token);
    }
}
