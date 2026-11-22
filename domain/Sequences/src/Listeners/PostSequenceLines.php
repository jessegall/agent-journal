<?php

declare(strict_types=1);

namespace Domain\Sequences\Listeners;

use App\Attributes\InCommandTransaction;
use App\Contracts\ChatLines;
use App\Contracts\Listener;
use App\Enums\LineCardPlacement;
use App\Support\Cards\DockIdentity;
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
        $run = $this->runs->heldBy($fact->follower(), $fact->runId());
        $source = new DockIdentity(SequenceRun::LINK_TYPE, $run->id);

        $this->lines->post($fact->follower(), $run->name, $fact->wordsFor($run), $source, LineCardPlacement::Panel);
    }
}
