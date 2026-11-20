<?php

declare(strict_types=1);

namespace App\Supervision\Support;

use App\Agents\Contracts\RuntimeStops;
use App\Agents\Models\WorkReservation;
use App\Assignments\Contracts\JournalAssignmentWriter;
use App\Supervision\Enums\WorkChainEnding;
use App\Supervision\Models\Ask;
use App\Supervision\Models\AskHop;
use App\Supervision\Models\CodeReview;

/**
 * Ends the chain of one certified work: its open review and merge asks close, its reservation is released to normal
 * cleanup, and its worker's runtime is asked to stop.
 */
final readonly class WorkChainEnd
{
    public function __construct(
        private JournalAssignmentWriter $assignments,
        private AskAttention $attention,
        private RuntimeStops $stops,
    ) {}

    public function end(CodeReview $review, WorkChainEnding $ending): void
    {
        foreach (Ask::openFor($review->work()) as $ask) {
            $hop = AskHop::currentFor($ask);
            $this->attention->retainReply($ask, $hop, "The work's chain ended: {$ending->value}.");
            $this->assignments->releaseForJournal($ask->assignmentIdentity());
            $ask->close();
            $this->attention->finishAnswering($hop->actor());
        }

        WorkReservation::lockedFor($review->certificate)->release();
        $this->stops->stopAgent($review->worker(), "chain-end:{$review->certificate}");
    }
}
