<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Contracts\Event;
use App\Support\ActorIdentity;
use Domain\Sequences\Contracts\SaidInChat;
use Domain\Sequences\Enums\SequenceRunState;
use Domain\Sequences\Models\SequenceRun;

/**
 * A sequence run ended, finished after its last step or cancelled, in the state it ended in.
 */
final readonly class SequenceEnded implements Event, SaidInChat
{
    public function __construct(
        public string $runId,
        public ActorIdentity $follower,
        public SequenceRunState $state,
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
        return $this->state->value;
    }
}
