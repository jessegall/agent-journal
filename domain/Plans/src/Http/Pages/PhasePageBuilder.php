<?php

declare(strict_types=1);

namespace Domain\Plans\Http\Pages;

use App\Reads\PageFormRequests;
use App\Time\Contracts\VerificationTiming;
use App\Web\Creation\Contracts\PageBuilder;
use Domain\Plans\Data\PhaseCheckData;
use Domain\Plans\Data\PhaseReaderData;
use Domain\Plans\Http\Requests\PhaseRequest;
use Domain\Plans\Models\Phase;
use Domain\Plans\Models\PhaseCheck;
use Domain\Plans\Support\PlanOutline;
use Illuminate\Http\Request;
use Spatie\LaravelData\Optional;

/**
 * One phase's record page: the phase within its plan, its counts from the phase's tallies, whether it is the plan's
 * current phase, whether the caller may run checks now, its latest check receipt, and the page of its tasks the reader
 * asked for, the same first page the plan's outline shows.
 */
final readonly class PhasePageBuilder implements PageBuilder
{
    public function __construct(
        private PageFormRequests $requests,
        private PlanOutline $outline,
        private VerificationTiming $timing,
    ) {}

    public function build(Request $visit): PhaseReaderData
    {
        $input = $this->requests->from(PhaseRequest::class, $visit);

        $phase = $input->phase();
        $ask = $input->outlinePageAsk();
        $progress = $phase->progress;

        return PhaseReaderData::build()
            ->planNumber((string) $phase->plan->number)
            ->planTitle($phase->plan->title)
            ->number((string) $phase->number)
            ->title($phase->title)
            ->finishedTasks($progress->finished)
            ->cancelledTasks($progress->cancelled)
            ->totalTasks($progress->total)
            ->isCurrent(
                (Phase::resolveCurrentNumbersOf(
                    [$phase->plan_id],
                )[$phase->plan_id] ?? null) === $phase->number,
            )
            ->canRunChecks($this->timing->forCaller()->isAllowed())
            ->tasks($this->outline->tasksOf($phase, $ask->tasksAfter, $ask->revision))
            ->checkReceipt(self::checkReceiptOf($phase))
            ->finish();
    }

    /**
     * The phase's latest check receipt, and whether it came after the phase's tallies last moved, which a placed or
     * changed task does.
     */
    private static function checkReceiptOf(Phase $phase): PhaseCheckData|Optional
    {
        $check = PhaseCheck::query()->ofPhase($phase)->newestRecordedFirst()->first();

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
