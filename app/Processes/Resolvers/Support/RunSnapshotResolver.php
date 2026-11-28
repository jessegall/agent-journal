<?php

declare(strict_types=1);

namespace App\Processes\Resolvers\Support;

use App\Bus\Contracts\ResultReceipts;
use App\Models\Runs\OutputAssessment;
use App\Models\Runs\PartRun;
use App\Models\Runs\ProcessRun;
use App\Models\Runs\ReaderPosition;
use App\Processes\Data\PartSnapshotData;
use App\Processes\Data\RunSnapshotData;
use App\Processes\Enums\PositionPurpose;
use Illuminate\Database\Eloquent\Builder;
use Symfony\Component\HttpKernel\Exception\NotFoundHttpException;

/**
 * The snapshot of one run of the selected project that the caller may see: every part with its lifecycle,
 * capture, live reading, latest assessment and receipt kept apart, and the run's last update number.
 */
final readonly class RunSnapshotResolver
{
    public function __construct(
        private ActivityProjection $activity,
        private ResultReceipts $receipts,
    ) {}

    /**
     * Whether the run is one of the selected project that the caller may see.
     */
    public function canSee(string $runId): bool
    {
        return $this->visibleRuns()->whereKey($runId)->exists();
    }

    public function snapshot(string $runId): RunSnapshotData
    {
        $run = $this->visibleRuns()->whereKey($runId)->firstOr(fn () => throw new NotFoundHttpException());

        $parts = $run->parts()->bySyntaxNodeThenAttempt()->limit(ProcessRun::PART_LIMIT)->get();

        return RunSnapshotData::from([
            'runId' => $run->id,
            'sequence' => $run->update_sequence,
            'mode' => $run->mode->value,
            'lifecycle' => $run->lifecycle->value,
            'isRunning' => ! $run->lifecycle->isFinal(),
            'parts' => array_values($parts->map(fn (PartRun $part) => $this->partOf($part))->all()),
        ]);
    }

    /**
     * @return Builder<ProcessRun>
     */
    private function visibleRuns(): Builder
    {
        return ProcessRun::query()->forActor();
    }

    private function partOf(PartRun $part): PartSnapshotData
    {
        $activity = $this->activity->ofPart($part);

        $position = ReaderPosition::query()
            ->ofPartRun($part->id)
            ->withPurpose(PositionPurpose::Live)
            ->first();

        $assessment = OutputAssessment::findLatestOf($part);
        $receipt = $this->receipts->forPart($part->id);
        $receipt = $receipt->isDefined() ? $receipt->get()->receiptId : null;

        return PartSnapshotData::of($part, $activity, $position, $assessment, $receipt);
    }
}
