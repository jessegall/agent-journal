<?php

declare(strict_types=1);

namespace App\Support\States\Contracts;

use App\Support\Inputs\Values\HookIdentity;
use App\Values\SettledStopAttempts;
use App\Values\StopAnswer;

/**
 * Answers a stop by the conditions the session was started under: it records the attempt and reads the host's
 * results, and never runs a command itself.
 */
interface StopConditionGate
{
    /**
     * How many failed attempts in a row, with the same failures and no change between them, hold the work.
     */
    public const int UNCHANGED_FAILURE_LIMIT = 3;

    /**
     * The gate's answer to the stop, a decision or a line to show the agent, judged against the attempts the stack
     * saw settle, with the attempt it opened.
     */
    public function answer(HookIdentity $stop, SettledStopAttempts $settled): StopAnswer;
}
