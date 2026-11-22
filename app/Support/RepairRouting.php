<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\HelperCommitImport;
use App\Contracts\WorkRepair;
use App\Enums\AskOriginType;
use App\Enums\CoreAskType;
use App\Enums\RepairRequestState;
use App\Enums\WorkRepairOutcome;
use App\Exceptions\HelperImportFailed;
use App\Models\CodeReview;
use App\Models\RepairRequest;
use App\Values\WorkRepairRequest;

/**
 * Sends reviewed work back to its worker for repair, once per decision or merge attempt: a conflict first copies the
 * target commit into the worker's checkout under refs/journal/repair/<source>, and after three repair rounds the
 * work becomes one stuck ask on the decider's route instead of a fourth. A copy that fails, or a repair no domain
 * can reopen, keeps the request pending and visible.
 */
final readonly class RepairRouting
{
    /**
     * How many repair rounds of one work go back to its worker before it becomes a stuck ask.
     */
    public const int ROUND_LIMIT = 3;

    public function __construct(
        private WorkRepair $repair,
        private HelperCommitImport $transfer,
        private AskTypeRegistry $types,
        private AskOpening $opening,
        private AskRouter $router,
    ) {}

    public function send(
        string $source,
        CodeReview $review,
        ActorIdentity $decider,
        string $findings,
        string|null $targetCommit,
    ): RepairRequest {
        $request = RepairRequest::retain($source, $review, $findings, $targetCommit);

        if ($request->state !== RepairRequestState::Pending) {
            return $request;
        }

        if ($request->earlierRounds() >= self::ROUND_LIMIT) {
            $this->cap($request, $decider);

            return $request;
        }

        $targetRef = null;

        if ($targetCommit !== null) {
            try {
                $targetRef = $this->transfer->transferTarget(
                    $review->work(),
                    $review->certificate,
                    $targetCommit,
                    $request->source,
                );
            } catch (HelperImportFailed) {
                return $request;
            }
        }

        $repair = new WorkRepairRequest($request->work(), $request->worker(), $findings, $request->source, $targetRef);

        if ($this->repair->reopen($repair) === WorkRepairOutcome::Reopened) {
            $request->settle(RepairRequestState::Reopened);
        }

        return $request;
    }

    private function cap(RepairRequest $request, ActorIdentity $decider): void
    {
        $ask = $this->opening->open(
            $decider,
            $this->types->get(CoreAskType::Stuck->key()),
            "repair-cap:{$request->work_type}:{$request->work_id}",
            'This work came back for repair three times; it needs a decision before it goes back again.',
            $request->work(),
            AskOriginType::Internal,
        );

        $request->settle(RepairRequestState::Capped);
        $this->router->route($ask, 0, null);
    }
}
