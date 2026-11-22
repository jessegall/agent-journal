<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Sessions\SessionPolicyReader;
use App\Models\SessionPolicy;
use App\Values\StartPolicy;

/**
 * Reads a session's policy from the row its start froze.
 */
final readonly class FrozenSessionPolicies implements SessionPolicyReader
{
    public function policyFor(string $sessionId): StartPolicy
    {
        return SessionPolicy::query()->where('session_id', $sessionId)->sole()->policy();
    }

    public function isFrozenFor(string $sessionId): bool
    {
        return SessionPolicy::query()->where('session_id', $sessionId)->exists();
    }
}
