<?php

declare(strict_types=1);

namespace App\Commands\MergeReviewedWork;

use App\Contracts\Admission\MergeAdmission;
use App\Contracts\Bus\CommandFacts;
use App\Contracts\Bus\CommandHandler;
use App\Events\MergeOutcomeRecorded;
use App\Models\MergeAttempt;
use App\Support\ActorIdentity;
use App\Support\ProtectedMerge;
use App\Values\MergeOutcome;
use App\Values\ReviewDecisionReference;

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
        $this->facts->runTransactionListeners();

        return $attempt->outcome();
    }
}
