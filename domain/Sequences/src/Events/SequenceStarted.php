<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Support\ActorReference;
use App\Support\RecordIdentity;
use App\Values\StackTarget;
use Domain\Sequences\Contracts\ChatLineSource;
use Domain\Sequences\Contracts\SequenceRunEvent;
use Domain\Sequences\Models\SequenceRun;

/**
 * A sequence run started for an agent and session, raised inside the transaction that started it.
 */
final readonly class SequenceStarted implements ChatLineSource, SequenceEvent, SequenceRunEvent
{
    public function __construct(
        public string $runId,
        public StackTarget $target,
    ) {}

    public function run(): RecordIdentity
    {
        return new RecordIdentity(SequenceRun::linkType(), $this->runId);
    }

    public function follower(): ActorReference
    {
        return $this->target->actorReference();
    }
}
