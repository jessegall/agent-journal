<?php

declare(strict_types=1);

namespace Domain\Sequences\Listeners;

use App\Hooks\Contracts\AgentStack;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Readers\Support\SequenceRecords;
use Domain\Sequences\States\Support\FollowingSequenceStateReference;

/**
 * Puts the started run on the agent's stack in the same transaction as the start.
 */
final readonly class PushSequenceState
{
    public function __construct(
        private SequenceRecords $runs,
        private AgentStack $stacks,
    ) {}

    public function handle(SequenceStarted $event): void
    {
        $this->stacks->push($event->target, FollowingSequenceStateReference::forRun($this->runs->followedBy($event->target, $event->runId)));
    }
}
