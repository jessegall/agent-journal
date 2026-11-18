<?php

declare(strict_types=1);

namespace Domain\Plans\Exceptions;

use App\Contracts\CommandRefusal;
use Domain\Plans\Enums\PlanState;
use RuntimeException;

/**
 * The tasks of a plan cannot be given out now: the plan is not started, or holds more tasks than one pool may list.
 */
final class PlanPoolUnavailable extends RuntimeException implements CommandRefusal
{
    public static function notStarted(int $planNumber, PlanState $state): self
    {
        return new self("Plan {$planNumber} is {$state->value}; its tasks are given out only while it is started.");
    }

    public static function tooLarge(int $planNumber, int $largest): self
    {
        return new self("Plan {$planNumber} holds more than {$largest} tasks, more than one pool may list.");
    }
}
