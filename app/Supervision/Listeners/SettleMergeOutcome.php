<?php

declare(strict_types=1);

namespace App\Supervision\Listeners;

use App\Agents\Enums\MergeAttemptState;
use App\Agents\Events\MergeOutcomeRecorded;
use App\Agents\Models\MergeAttempt;
use App\Agents\Models\WorkReservation;
use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Contracts\Listener;
use App\Supervision\Models\AskHop;
use App\Supervision\Models\CodeReview;
use App\Supervision\Support\AskAttention;
use App\Supervision\Support\AskRecords;
use App\Supervision\Support\RepairRouting;
use App\Supervision\Values\AskReference;

/**
 * Settles a merge ask by the attempt it admitted, not by whoever holds it now: a merge ends the work's chain and
 * releases its reservation, a conflict sends the work back for repair onto the captured target, and any other refusal
 * or an uncertain effect tells the requester and leaves the ask open for its holder.
 */
final readonly class SettleMergeOutcome implements Listener
{
    public function __construct(
        private AskRecords $asks,
        private JournalAssignmentWriter $assignments,
        private AskAttention $attention,
        private RepairRouting $repairs,
    ) {}

    public function handle(MergeOutcomeRecorded $event): void
    {
        $attempt = MergeAttempt::query()->findOrFail($event->attemptId);
        $ask = $this->asks->lock(new AskReference($attempt->ask_id));
        $hop = AskHop::currentFor($ask);
        $summary = match ($attempt->state) {
            MergeAttemptState::Merged => "Merged as {$attempt->result} onto {$attempt->target_branch}.",
            default => "Not merged ({$attempt->state->value}): {$attempt->evidence}",
        };
        $this->attention->retainReply($ask, $hop, $summary);

        if ($attempt->state === MergeAttemptState::Merged || $attempt->refusal?->needsRepair() === true) {
            $this->assignments->releaseForJournal($ask->assignmentIdentity());
            $ask->close();
            $this->attention->finishAnswering($hop->holder());
        }

        if ($attempt->state === MergeAttemptState::Merged) {
            WorkReservation::lockedFor($attempt->certificate)->release();
        }

        if ($attempt->refusal?->needsRepair() === true) {
            $review = CodeReview::query()->where('certificate', $attempt->certificate)->sole();
            $this->repairs->send(
                "merge:{$attempt->id}",
                $review,
                $attempt->admittedActor(),
                (string) $attempt->evidence,
                $attempt->target_before,
            );
        }
    }
}
