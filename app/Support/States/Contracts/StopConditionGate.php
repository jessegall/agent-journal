<?php

declare(strict_types=1);

namespace App\Support\States\Contracts;

use App\Support\Decisions\Decision;
use App\Support\Decisions\MessageLine;
use App\Support\Inputs\Values\HookIdentity;

/**
 * Answers a stop by the conditions the session was started under: it records the attempt and reads the host's
 * results, and never runs a command itself.
 */
interface StopConditionGate
{
    public function answer(HookIdentity $stop): Decision|MessageLine;
}
