<?php

declare(strict_types=1);

namespace Domain\Sequences\Events;

use App\Support\ActorReference;
use App\Support\RecordIdentity;
use Domain\Sequences\Contracts\ChatLineSource;
use Domain\Sequences\Contracts\SequenceStepEvent;
use Domain\Sequences\Models\SequenceRun;

/**
 * A step of a sequence run ended, numbered from one, as its agent went on past it.
 */
final readonly class SequenceStepEnded implements ChatLineSource, SequenceEvent, SequenceStepEvent
{
    public function __construct(
        public string $runId,
        public ActorReference $follower,
        public int $step,
    ) {}

    public function run(): RecordIdentity
    {
        return new RecordIdentity(SequenceRun::linkType(), $this->runId);
    }

    public function follower(): ActorReference
    {
        return $this->follower;
    }
}
