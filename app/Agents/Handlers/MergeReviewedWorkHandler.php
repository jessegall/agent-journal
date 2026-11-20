<?php

declare(strict_types=1);

namespace App\Agents\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Agents\Commands\MergeReviewedWork;
use App\Agents\Contracts\MergeAdmission;
use App\Agents\Events\MergeOutcomeRecorded;
use App\Agents\Models\MergeAttempt;
use App\Agents\Support\ProtectedMerge;
use App\Agents\Values\MergeOutcome;
use App\Agents\Values\ReviewDecisionReference;
use App\Contracts\CommandHandler;
use Illuminate\Contracts\Events\Dispatcher;

/**
 * Admits the merge, retains its one attempt, merges it if it has not run yet, and tells supervision how it ended.
 */
final readonly class MergeReviewedWorkHandler implements CommandHandler
{
    public function __construct(
        private MergeAdmission $admission,
        private ProtectedMerge $merge,
        private Dispatcher $events,
    ) {}

    public function handle(MergeReviewedWork $command): MergeOutcome
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

        $this->merge->merge($attempt);
        $this->events->dispatch(new MergeOutcomeRecorded($attempt->id));

        return $attempt->outcome();
    }
}
