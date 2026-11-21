<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Processes\Contracts\VerificationTiming;
use App\Ui\Contracts\PageResolver;
use Domain\Plans\Api\PlanProgress;
use Domain\Plans\Data\PhaseCheckData;
use Domain\Plans\Data\PhaseReaderData;
use Domain\Plans\Http\Requests\PhaseRequest;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseCheck;
use Domain\Tasks\Api\TaskSummary;
use Domain\Tasks\Contracts\TaskResolver;
use Spatie\LaravelData\Optional;

/**
 * One phase's record page: the phase within its plan, its counts from the phase's tallies, whether it is the plan's
 * current phase, whether the caller may run checks now, its latest check receipt, and its tasks by number.
 */
final readonly class PhaseWindowResolver implements PageResolver
{
    public function __construct(
        private PhaseRequest $request,
        private TaskResolver $tasks,
        private VerificationTiming $timing,
    ) {}

    public function read(): PhaseReaderData
    {
        $phase = $this->request->phase();
        $tasks = $this->tasks->summaries($phase->taskIds());
        $progress = $phase->progress;

        return PhaseReaderData::from([
            'planNumber' => (string) $phase->plan->number,
            'planTitle' => $phase->plan->title,
            'number' => (string) $phase->number,
            'title' => $phase->title,
            'finishedTasks' => $progress->finished,
            'cancelledTasks' => $progress->cancelled,
            'totalTasks' => $progress->total,
            'isCurrent' => PlanProgress::currentPhaseOf(Phase::progressOfPhasesIn($phase->plan_id)) === $phase->number,
            'canRunChecks' => $this->timing->forCaller()->isAllowed(),
            'tasks' => $tasks,
            'checkReceipt' => self::checkReceiptOf($phase, $tasks),
        ]);
    }

    /**
     * @param  list<TaskSummary>  $tasks
     */
    private static function checkReceiptOf(Phase $phase, array $tasks): PhaseCheckData|Optional
    {
        $check = PhaseCheck::query()->ofPhase($phase)->latest('recorded_at')->first();

        if ($check === null) {
            return Optional::create();
        }

        $changes = array_map(fn (TaskSummary $task) => $task->changedAt, $tasks);

        return PhaseCheckData::from([
            'operation' => $check->operation,
            'outcome' => $check->outcome,
            'recordedAt' => $check->recorded_at->toIso8601String(),
            'isAfterLastChange' => $changes === [] || $check->recorded_at->greaterThanOrEqualTo(max($changes)),
        ]);
    }
}
