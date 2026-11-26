<?php

declare(strict_types=1);

namespace App\Sessions;

use App\Models\Sessions\SessionPolicy;
use App\Sessions\Contracts\SessionPolicyReader as SessionPolicyReaderContract;
use App\Sessions\Values\StartPolicy;

/**
 * Reads a session's policy from the row its start froze.
 */
final readonly class SessionPolicyReader implements SessionPolicyReaderContract
{
    public function policyFor(string $sessionId): StartPolicy
    {
        return SessionPolicy::query()->ofSession($sessionId)->sole()->policy;
    }

    public function isFrozenFor(string $sessionId): bool
    {
        return SessionPolicy::query()->ofSession($sessionId)->exists();
    }
}
