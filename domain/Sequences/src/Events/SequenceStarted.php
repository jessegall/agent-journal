<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Contracts\Event;
use App\Support\ActorIdentity;
use App\Values\StackTarget;
use Domain\Sequences\Contracts\SaidInChat;
use Domain\Sequences\Models\SequenceRun;

/**
 * A sequence run started for an agent and session, raised inside the transaction that started it.
 */
final readonly class SequenceStarted implements Event, SaidInChat
{
    public function __construct(
        public string $runId,
        public StackTarget $target,
    ) {}

    public function runId(): string
    {
        return $this->runId;
    }

    public function follower(): ActorIdentity
    {
        return $this->target->actorIdentity();
    }

    public function wordsFor(SequenceRun $run): string
    {
        return 'started';
    }
}
