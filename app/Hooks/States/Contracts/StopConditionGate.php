<?php

declare(strict_types=1);

namespace App\Hooks\States\Contracts;

use App\Hooks\Decisions\Decision;
use App\Hooks\Inputs\HookIdentity;

/**
 * Answers a stop by the conditions the session was started under: it records the attempt and reads the host's
 * results, and never runs a command itself.
 */
interface StopConditionGate
{
    public function answer(HookIdentity $stop): Decision;
}
