<?php

declare(strict_types=1);

namespace App\Agents\Contracts;

use App\Agents\Support\LaunchPolicy;

/**
 * The policy a session was launched under, as it was frozen then.
 */
interface SessionPolicyReader
{
    public function policyFor(string $sessionId): LaunchPolicy;
}
