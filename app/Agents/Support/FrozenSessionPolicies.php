<?php

declare(strict_types=1);

namespace App\Agents\Support;

use App\Agents\Contracts\SessionPolicyReader;
use App\Agents\Models\SessionPolicy;

/**
 * Reads a session's policy from the row its launch froze.
 */
final readonly class FrozenSessionPolicies implements SessionPolicyReader
{
    public function policyFor(string $sessionId): LaunchPolicy
    {
        return SessionPolicy::query()->where('session_id', $sessionId)->sole()->policy();
    }
}
