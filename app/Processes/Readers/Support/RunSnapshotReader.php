<?php

declare(strict_types=1);

namespace App\Processes\Readers\Support;

use App\Processes\Contracts\ResultReceipts;
use App\Processes\Data\PartSnapshotData;
use App\Processes\Data\RunSnapshotData;
use App\Processes\Enums\PositionPurpose;
use App\Processes\Models\OutputAssessment;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\ReaderPosition;
use App\Processes\Support\ProjectKey;
use App\Processes\Values\OutputProblem;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The snapshot of one run of the current project that the caller may see (rule 4): every part with its lifecycle,
 * capture, live reading, latest assessment and receipt kept apart, and the run's last update number.
 */
final readonly class RunSnapshotReader
{
    public function __construct(
        private ProjectKey $projects,
        private ActivityProjection $activity,
        private ResultReceipts $receipts,
    ) {}

    public function snapshot(string $runId): RunSnapshotData
    {
        $run = ProcessRun::query()
            ->forActor()
            ->where('project_key', $this->projects->current())
            ->whereKey($runId)
            ->first() ?? throw new NotFoundHttpException();
        $parts = $run->parts()->orderBy('syntax_node')->orderBy('attempt')->readLimit(500)->get();

        return new RunSnapshotData(
            $run->id,
            $run->update_sequence,
            $run->mode->value,
            $run->lifecycle->value,
            array_values($parts->map(fn (PartRun $part): PartSnapshotData => $this->partOf($part))->all()),
        );
    }

    private function partOf(PartRun $part): PartSnapshotData
    {
        $activity = $this->activity->ofPart($part);
        $position = ReaderPosition::query()
            ->where('part_run_id', $part->id)
            ->where('purpose', PositionPurpose::Live->value)
            ->first();
        $assessment = OutputAssessment::query()->where('part_run_id', $part->id)->latest('created_at')->first();
        $receipt = $this->receipts->forPart($part->id);
        $problems = $assessment === null ? [] : $assessment->problems;
        $codes = array_map(fn (OutputProblem $problem): string => $problem->code->value, $problems);
        $end = $part->end()->hasStatus() ? "{$part->end_type->value} {$part->end_code}" : $part->end_type->value;

        return new PartSnapshotData(
            $part->id,
            $part->operation,
            $activity->lifecycle,
            $end,
            $part->capture_state->value,
            $activity->elapsedSeconds,
            $activity->bytes,
            $activity->latestLine,
            $position === null ? '' : $position->reader_revision_id,
            $position === null ? 'no reader' : $position->interpretation->value,
            $assessment === null ? '' : $assessment->id,
            $assessment === null ? '' : $assessment->outcome->value,
            $codes,
            $receipt->isDefined() ? $receipt->get()->receiptId : '',
        );
    }
}
