<?php

declare(strict_types=1);

namespace App\Contracts\Authorization;

use App\Values\AccessDecision;
use App\Values\Operation;

/**
 * Whether the acting agent's policy lets it run one native operation: a file read, search, edit, shell part, network
 * or other tool call, decided by the policy its session started under.
 */
interface OperationPolicy
{
    /**
     * Whether the operation is allowed, and the reason either way.
     */
    public function assess(Operation $operation): AccessDecision;
}
