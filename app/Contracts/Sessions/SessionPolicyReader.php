<?php

declare(strict_types=1);

namespace App\Contracts\Sessions;

use App\Values\StartPolicy;

/**
 * The policy a session was started under, as it was frozen then.
 */
interface SessionPolicyReader
{
    /**
     * The start policy the session runs under.
     */
    public function policyFor(string $sessionId): StartPolicy;

    /**
     * Whether the session was started under a frozen policy; a session the journal did not start has none.
     */
    public function isFrozenFor(string $sessionId): bool;
}
