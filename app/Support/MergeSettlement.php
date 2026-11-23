<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\JournalAssignmentWriter;
use App\Enums\MergeAttemptState;
use App\Enums\WorkChainEnding;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Models\Reviews\CodeReview;
use App\Models\Reviews\MergeAttempt;

/**
 * Settles a merge ask by the attempt it admitted, not by whoever holds it now: a merge ends the work's chain, a conflict sends the work back for repair onto the captured target, and any other refusal
 * or an uncertain effect tells the requester and leaves the ask open for its holder.
 */
final readonly class MergeSettlement
{
    public function __construct(
        private JournalAssignmentWriter $assignments,
        private AskAttention $attention,
        private RepairRouting $repairs,
        private WorkChainEnd $chains,
    ) {}

    /**
     * Settles one ended attempt once; an attempt settled before changes nothing.
     */
    public function settle(MergeAttempt $attempt): void
    {
        if ($attempt->acknowledged_at !== null) {
            return;
        }

        $ask = Ask::lockedForMaintenance($attempt->ask_id);
        $hop = AskHop::currentFor($ask);

        $summary = match ($attempt->state) {
            MergeAttemptState::Merged => "Merged as {$attempt->result} onto {$attempt->target_branch}.",
            default => "Not merged ({$attempt->state->value}): {$attempt->evidence}",
        };

        $this->attention->retainReply($ask, $hop, $summary);

        if ($attempt->state === MergeAttemptState::Merged || $attempt->refusal?->needsRepair() === true) {
            $this->assignments->releaseForJournal($ask->assignmentIdentity());
            $ask->close();
            $this->attention->finishAnswering($hop->actor());
        }

        if ($attempt->state === MergeAttemptState::Merged) {
            $this->chains->end(
                CodeReview::query()->where('certificate', $attempt->certificate)->sole(),
                WorkChainEnding::Merged,
            );
        }

        if ($attempt->refusal?->needsRepair() === true) {
            $review = CodeReview::query()->where('certificate', $attempt->certificate)->sole();

            $this->repairs->send(
                "merge:{$attempt->id}",
                $review,
                $attempt->actor(),
                (string) $attempt->evidence,
                $attempt->target_before,
            );
        }

        $attempt->acknowledge();
    }
}
