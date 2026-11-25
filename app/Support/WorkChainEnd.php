<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\JournalAssignmentWriter;
use App\Contracts\Processes\RuntimeStops;
use App\Enums\WorkChainEnding;
use App\Models\Asks\Ask;
use App\Models\Asks\AskHop;
use App\Models\Reviews\CodeReview;
use App\Models\Reviews\WorkReservation;

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
        }

        WorkReservation::lockedFor($review->certificate)->release();
        $this->stops->stopAgent($review->worker(), "chain-end:{$review->certificate}");
    }
}
