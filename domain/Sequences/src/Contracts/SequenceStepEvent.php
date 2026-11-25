<?php

declare(strict_types=1);

namespace Domain\Sequences\Contracts;

use App\Support\ActorIdentity;

/**
 * A step of a sequence run reached or ended.
 */
interface SequenceStepEvent extends SequenceRunEvent
{
    public ActorIdentity $follower { get; }

    public int $step { get; }
}
