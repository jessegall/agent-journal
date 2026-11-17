<?php

declare(strict_types=1);

namespace App\Domain\Sequences\Listeners;

use App\Core\Hooks\Contracts\AgentStack;
use App\Domain\Sequences\Events\SequenceStarted;
use App\Domain\Sequences\Readers\Support\SequenceRecords;
use App\Domain\Sequences\States\Support\FollowingSequenceStateReference;

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
