<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\StartPolicy;

/**
 * The policy a session was started under, as it was frozen then.
 */
interface SessionPolicyReader
{
    public function policyFor(string $sessionId): StartPolicy;
}
