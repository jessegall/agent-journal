<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Contracts\Event;
use App\Support\ActorIdentity;

/**
 * A step of a sequence run ended, numbered from one, as its agent went on past it.
 */
final readonly class SequenceStepEnded implements Event
{
    public function __construct(
        public string $runId,
        public ActorIdentity $follower,
        public int $step,
    ) {}
}
