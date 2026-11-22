<?php

declare(strict_types=1);

namespace Domain\Sequences\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Support\ChatLines;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Events\SequenceStepEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Sequences\Resolvers\Support\SequenceRecords;

/**
 * Says in the chats of the agent following a run what the run does: it started, came to a step, ended a step, ended.
 */
#[InCommandTransaction]
final readonly class PostSequenceLines implements Listener
{
    public function __construct(
        private SequenceRecords $runs,
        private ChatLines $lines,
    ) {}

    public function handle(SequenceStarted|SequenceStepReached|SequenceStepEnded|SequenceEnded $fact): void
    {
        $follower = $fact instanceof SequenceStarted ? $fact->target->actorIdentity() : $fact->follower;
        $run = $this->runs->heldBy($follower, $fact->runId);

        $this->lines->post($follower, $run->name, match (true) {
            $fact instanceof SequenceStarted => 'started',
            $fact instanceof SequenceStepReached => $run->stepLine($fact->step),
            $fact instanceof SequenceStepEnded => "step {$fact->step} ended",
            $fact instanceof SequenceEnded => $fact->state->value,
        });
    }
}
