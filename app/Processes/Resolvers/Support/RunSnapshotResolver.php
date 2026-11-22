<?php

declare(strict_types=1);

namespace App\Processes\Resolvers\Support;

use App\Processes\Contracts\ResultReceipts;
use App\Processes\Data\PartSnapshotData;
use App\Processes\Data\RunSnapshotData;
use App\Processes\Enums\PositionPurpose;
use App\Processes\Models\OutputAssessment;
use App\Processes\Models\PartRun;
use App\Processes\Models\ProcessRun;
use App\Processes\Models\ReaderPosition;
use App\Processes\Support\ProjectKey;
use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The snapshot of one run of the current project that the caller may see (rule 4): every part with its lifecycle,
 * capture, live reading, latest assessment and receipt kept apart, and the run's last update number.
 */
final readonly class RunSnapshotResolver
{
    public function __construct(
        private ProjectKey $projects,
        private ActivityProjection $activity,
        private ResultReceipts $receipts,
    ) {}

    /**
     * Whether the run is one of the current project that the caller may see.
     */
    public function canSee(string $runId): bool
    {
        return $this->visibleRuns()->whereKey($runId)->exists();
    }

    public function snapshot(string $runId): RunSnapshotData
    {
        $run = $this->visibleRuns()->whereKey($runId)->firstOr(fn () => throw new NotFoundHttpException());

        $parts = $run->parts()->orderBy('syntax_node')->orderBy('attempt')->readLimit(500)->get();

        return RunSnapshotData::from([
            'runId' => $run->id,
            'sequence' => $run->update_sequence,
            'mode' => $run->mode->value,
            'lifecycle' => $run->lifecycle->value,
            'parts' => array_values($parts->map(fn (PartRun $part) => $this->partOf($part))->all()),
        ]);
    }

    /**
     * @return Builder<ProcessRun>
     */
    private function visibleRuns(): Builder
    {
        return ProcessRun::query()->forActor()->where('project_key', $this->projects->current());
    }

    private function partOf(PartRun $part): PartSnapshotData
    {
        $activity = $this->activity->ofPart($part);

        $position = ReaderPosition::query()
            ->where('part_run_id', $part->id)
            ->where('purpose', PositionPurpose::Live->value)
            ->first();

        $assessment = OutputAssessment::latestOf($part);
        $receipt = $this->receipts->forPart($part->id);
        $receipt = $receipt->isDefined() ? $receipt->get()->receiptId : null;

        return PartSnapshotData::of($part, $activity, $position, $assessment, $receipt);
    }
}
