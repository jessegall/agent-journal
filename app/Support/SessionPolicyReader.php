<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sessions\SessionPolicyReader as SessionPolicyReaderContract;
use App\Models\Sessions\SessionPolicy;
use App\Values\StartPolicy;

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
