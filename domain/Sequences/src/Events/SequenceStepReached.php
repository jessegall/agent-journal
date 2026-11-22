<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Contracts\Event;
use App\Support\ActorIdentity;

/**
 * A sequence run came to a step, numbered from one, which its agent now follows.
 */
final readonly class SequenceStepReached implements Event
{
    public function __construct(
        public string $runId,
        public ActorIdentity $follower,
        public int $step,
    ) {}
}
