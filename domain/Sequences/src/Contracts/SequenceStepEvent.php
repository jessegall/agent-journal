<?php

declare(strict_types=1);

namespace Domain\Sequences\Contracts;

use App\Support\ActorReference;

/**
 * A step of a sequence run reached or ended.
 */
interface SequenceStepEvent extends SequenceRunEvent
{
    public ActorReference $follower { get; }

    public int $step { get; }
}
