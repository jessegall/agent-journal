<?php

declare(strict_types=1);

namespace App\Agents\Commands\MergeReviewedWork;

use App\Actors\Support\ActorIdentity;
use App\Agents\Contracts\MergeAdmission;
use App\Agents\Events\MergeOutcomeRecorded;
use App\Agents\Models\MergeAttempt;
use App\Agents\Support\ProtectedMerge;
use App\Agents\Values\MergeOutcome;
use App\Agents\Values\ReviewDecisionReference;
use App\Bus\Contracts\CommandFacts;
use App\Contracts\CommandHandler;

/**
 * Admits the merge, retains its one attempt, merges it if it never ran or inspects what an interrupted run left, and
 * tells supervision how it ended.
 */
final readonly class MergeReviewedWorkHandler implements CommandHandler
{
    public function __construct(
        private MergeAdmission $admission,
        private ProtectedMerge $merge,
        private CommandFacts $facts,
    ) {}

    public function handle(MergeReviewedWorkCommand $command): MergeOutcome
    {
        $approved = $this->admission->requireApproval(
            ActorIdentity::of($command->dispatchedBy()),
            new ReviewDecisionReference($command->decisionId),
            $command->expectedVersion,
        );

        $attempt = MergeAttempt::retain($approved);

        if ($attempt->state->isTerminal()) {
            return $attempt->outcome();
        }

        if ($attempt->wasRecentlyCreated) {
            $this->merge->merge($attempt);
        } else {
            $this->merge->inspect($attempt);
        }

        $this->facts->publishAfterCommit(new MergeOutcomeRecorded($attempt->id));
        $this->facts->applyRequired();

        return $attempt->outcome();
    }
}
