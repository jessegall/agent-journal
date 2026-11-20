<?php

declare(strict_types=1);

namespace App\Hooks\Contracts;

use App\Agents\Values\AccessDecision;
use App\Agents\Values\Operation;

/**
 * Whether the acting agent's policy lets it run one native operation: a file read, search, edit, shell part, network
 * or other tool call, decided by the policy its session started under.
 */
interface OperationPolicy
{
    public function assess(Operation $operation): AccessDecision;
}
