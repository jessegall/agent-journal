<?php

declare(strict_types=1);

namespace App\Support\Execution;

use App\Processes\Execution\RunState;

/**
 * A supervised run whose root step ended: its outcome and the run's state, which may still hold background parts.
 */
final readonly class RunEnded
{
    public function __construct(public StepOutcome $outcome, public RunState $state) {}
}
