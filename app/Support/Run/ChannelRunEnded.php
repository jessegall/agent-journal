<?php

declare(strict_types=1);

namespace App\Support\Run;

use App\Support\Execution\StepOutcome;

/**
 * A supervised run that ended, with the channel its root status still has to go over.
 */
final readonly class ChannelRunEnded
{
    public function __construct(public RunChannel $channel, public StepOutcome $outcome) {}
}
