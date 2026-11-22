<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Contracts\Event;
use App\Support\ActorIdentity;
use Domain\Sequences\Contracts\ChatLineSource;
use Domain\Sequences\Models\SequenceRun;

/**
 * A step of a sequence run ended, numbered from one, as its agent went on past it.
 */
final readonly class SequenceStepEnded implements ChatLineSource, Event
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
        return "step {$this->step} ended";
    }
}
