<?php

declare(strict_types=1);

namespace Domain\Sequences\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Events\Listener;
use App\Contracts\Work\AgentStack;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Resolvers\Support\SequenceRecords;
use Domain\Sequences\Support\States\Support\FollowSequenceStateReference;

/**
 * Puts the started run on the agent's stack in the same transaction as the start.
 */
#[InCommandTransaction]
final readonly class PushSequenceState implements Listener
{
    public function __construct(
        private SequenceRecords $runs,
        private AgentStack $stacks,
    ) {}

    public function handle(SequenceStarted $event): void
    {
        $this->stacks->push(
            $event->target,
            FollowSequenceStateReference::forRun($this->runs->followedBy($event->target, $event->runId)),
        );
    }
}
