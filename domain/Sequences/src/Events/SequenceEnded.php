<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Support\ActorIdentity;
use App\Support\RecordIdentity;
use Domain\Sequences\Contracts\ChatLineSource;
use Domain\Sequences\Contracts\SequenceRunEvent;
use Domain\Sequences\Enums\SequenceRunStatus;
use Domain\Sequences\Models\SequenceRun;

/**
 * A sequence run ended, finished after its last step or cancelled, in the state it ended in.
 */
final readonly class SequenceEnded implements ChatLineSource, SequenceEvent, SequenceRunEvent
{
    public function __construct(
        public string $runId,
        public ActorIdentity $follower,
        public SequenceRunStatus $state,
    ) {}

    public function run(): RecordIdentity
    {
        return new RecordIdentity(SequenceRun::linkType(), $this->runId);
    }

    public function follower(): ActorIdentity
    {
        return $this->follower;
    }
}
