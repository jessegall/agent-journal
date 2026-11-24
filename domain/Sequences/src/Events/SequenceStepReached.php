<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Support\ActorIdentity;
use Domain\Sequences\Contracts\ChatLineSource;
use Domain\Sequences\Contracts\SequenceStepEvent;
use Domain\Sequences\Models\SequenceRun;

/**
 * A sequence run came to a step, numbered from one, which its agent now follows.
 */
final readonly class SequenceStepReached extends SequenceEvent implements ChatLineSource, SequenceStepEvent
{
    public function __construct(
        public string $runId,
        public ActorIdentity $follower,
        public int $step,
    ) {}

    public function runId(): string
    {
        return $this->runId;
    }

    public function follower(): ActorIdentity
    {
        return $this->follower;
    }

    public function wordsFor(SequenceRun $run): string
    {
        return $run->stepLine($this->step);
    }
}
