<?php

declare(strict_types=1);

namespace Domain\Sequences\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\Listener;
use App\Enums\LineCardPlacement;
use App\Support\Cards\DockIdentity;
use App\Support\ChatLines;
use Domain\Sequences\Events\SequenceEnded;
use Domain\Sequences\Events\SequenceStarted;
use Domain\Sequences\Events\SequenceStepEnded;
use Domain\Sequences\Events\SequenceStepReached;
use Domain\Sequences\Models\SequenceRun;
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

        $this->lines->post($follower, $run->name, $this->wordsFor($fact, $run), new DockIdentity(SequenceRun::LINK_TYPE, $run->id), LineCardPlacement::Panel);
    }

    private function wordsFor(SequenceStarted|SequenceStepReached|SequenceStepEnded|SequenceEnded $fact, SequenceRun $run): string
    {
        return match (true) {
            $fact instanceof SequenceStarted => 'started',
            $fact instanceof SequenceStepReached => $run->stepLine($fact->step),
            $fact instanceof SequenceStepEnded => "step {$fact->step} ended",
            $fact instanceof SequenceEnded => $fact->state->value,
        };
    }
}
