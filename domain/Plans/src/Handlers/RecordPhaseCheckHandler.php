<?php

declare(strict_types=1);

namespace Domain\Plans\Handlers;

use App\Actors\Support\ActorIdentity;
use App\Processes\Contracts\ResultReceipts;
use App\Processes\Enums\AssessmentOutcome;
use Domain\Plans\Commands\RecordPhaseCheck;
use Domain\Plans\Exceptions\PhaseCheckRefused;
use Domain\Plans\Handlers\Support\PlanCommandHandler;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseCheck;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Contracts\TaskResolver;

/**
 * Accepts a check result for a phase only through Core's one result gate: a current receipt (never an evidence run,
 * a run without a result or a superseded receipt) published after the phase's tasks last changed.
 */
final readonly class RecordPhaseCheckHandler extends PlanCommandHandler
{
    public function __construct(
        private ResultReceipts $receipts,
        private TaskResolver $tasks,
    ) {}

    /**
     * @throws PhaseCheckRefused
     */
    public function handle(RecordPhaseCheck $command): string
    {
        $phase = Phase::query()->whereKey($command->phaseId)->sole();
        $missingReceipt = PhaseCheckRefused::noReceipt($command->receiptId);
        $receipt = $this->receipts->find($command->receiptId)->getOrThrow($missingReceipt);

        if ($receipt->outcome === AssessmentOutcome::Unavailable) {
            throw PhaseCheckRefused::noReceipt($receipt->receiptId);
        }

        $changes = array_map(fn (TaskSummary $task) => $task->changedAt, $this->tasks->summaries($phase->taskIds()));

        if ($changes !== [] && $receipt->publishedAt->lessThan(max($changes))) {
            throw PhaseCheckRefused::stale($receipt->receiptId, $receipt->runId);
        }

        return PhaseCheck::record($phase, $receipt, ActorIdentity::of($command->dispatchedBy()))->id;
    }
}
