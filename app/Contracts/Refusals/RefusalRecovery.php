<?php

declare(strict_types=1);

namespace App\Contracts\Refusals;

use App\Values\RecoveryCall;

/**
 * A refusal that may name the tool call that gets the caller out of it, which a receipt keeps for a replay.
 */
interface RefusalRecovery
{
    public function recovery(): RecoveryCall|null;
}
