<?php

declare(strict_types=1);

namespace App\Domain\Sequences\Listeners;

use App\Domain\Hooks\AgentStacks;
use App\Domain\Sequences\Events\SequenceStarted;
use App\Domain\Sequences\FollowingSequenceReference;
use App\Domain\Sequences\SequenceRecords;

/**
 * Puts the started run on the agent's stack in the same transaction as the start.
 */
final readonly class PushSequenceState
{
    public function __construct(
        private SequenceRecords $runs,
        private AgentStacks $stacks,
    ) {}

    public function handle(SequenceStarted $event): void
    {
        $this->stacks->push($event->target, FollowingSequenceReference::forRun($this->runs->followedBy($event->target, $event->runId)));
    }
}
