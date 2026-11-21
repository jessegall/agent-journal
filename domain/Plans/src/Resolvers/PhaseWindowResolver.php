<?php

declare(strict_types=1);

namespace Domain\Plans\Resolvers;

use App\Processes\Contracts\VerificationTiming;
use App\Ui\Contracts\PageResolver;
use Domain\Plans\Data\PhaseCheckData;
use Domain\Plans\Data\PhaseReaderData;
use Domain\Plans\Http\Requests\PhaseRequest;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseCheck;
use Domain\Plans\Support\PlanOutline;
use Spatie\LaravelData\Optional;

/**
 * One phase's record page: the phase within its plan, its counts from the phase's tallies, whether it is the plan's
 * current phase, whether the caller may run checks now, its latest check receipt, and the page of its tasks the reader
 * asked for, the same first page the plan's outline shows.
 */
final readonly class PhaseWindowResolver implements PageResolver
{
    public function __construct(
        private PhaseRequest $request,
        private PlanOutline $outline,
        private VerificationTiming $timing,
    ) {}

    public function read(): PhaseReaderData
    {
        $phase = $this->request->phase();
        $ask = $this->request->outlinePageAsk();
        $progress = $phase->progress;

        return PhaseReaderData::from([
            'planNumber' => (string) $phase->plan->number,
            'planTitle' => $phase->plan->title,
            'number' => (string) $phase->number,
            'title' => $phase->title,
            'finishedTasks' => $progress->finished,
            'cancelledTasks' => $progress->cancelled,
            'totalTasks' => $progress->total,
            'isCurrent' => (Phase::currentNumbersOf([$phase->plan_id])[$phase->plan_id] ?? null) === $phase->number,
            'canRunChecks' => $this->timing->forCaller()->isAllowed(),
            'tasks' => $this->outline->tasksOf($phase, $ask->tasksAfter, $ask->revision),
            'checkReceipt' => self::checkReceiptOf($phase),
        ]);
    }

    /**
     * The phase's latest check receipt, and whether it came after the phase's tallies last moved, which a placed or
     * changed task does.
     */
    private static function checkReceiptOf(Phase $phase): PhaseCheckData|Optional
    {
        $check = PhaseCheck::query()->ofPhase($phase)->latest('recorded_at')->first();

        if ($check === null) {
            return Optional::create();
        }

        return PhaseCheckData::from([
            'operation' => $check->operation,
            'outcome' => $check->outcome,
            'recordedAt' => $check->recorded_at->toIso8601String(),
            'isAfterLastChange' => $phase->updated_at === null
                || $check->recorded_at->greaterThanOrEqualTo($phase->updated_at),
        ]);
    }
}
