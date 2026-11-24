<?php

declare(strict_types=1);

namespace App\Data\Processes;

use App\Models\Runs\OutputAssessment;
use App\Models\Runs\PartRun;
use App\Models\Runs\ReaderPosition;
use App\Values\OutputProblem;
use App\Values\PartActivity;
use Spatie\LaravelData\Data;
use Spatie\TypeScriptTransformer\Attributes\TypeScript;

/**
 * One part of a run as a snapshot shows it: the four observations kept apart (lifecycle with its own end, capture,
 * the reader's live reading, the assessment and its receipt), with its activity.
 */
#[TypeScript]
final class PartSnapshotData extends Data
{
    /**
     * @param  array<string, int>  $bytes
     * @param  list<string>  $problems
     */
    public function __construct(
        public readonly string $id,
        public readonly string $operation,
        public readonly string $lifecycle,
        public readonly string $end,
        public readonly string $capture,
        public readonly int $elapsedSeconds,
        public readonly array $bytes,
        public readonly string|null $latestLine,
        public readonly string|null $readerRevisionId,
        public readonly string $reading,
        public readonly string|null $assessmentId,
        public readonly string|null $outcome,
        public readonly array $problems,
        public readonly string|null $receiptId,
    ) {}

    /**
     * A part as its page shows it: the part's own record, its live activity, the live reader's position, the latest
     * assessment and the receipt that answers it, each null while there is none.
     */
    public static function of(
        PartRun $part,
        PartActivity $activity,
        ReaderPosition|null $position,
        OutputAssessment|null $assessment,
        string|null $receiptId,
    ): self {
        $end = $part->end()->hasStatus() ? "{$part->end_type->value} {$part->end_code}" : $part->end_type->value;
        $problems = $assessment === null ? [] : $assessment->problems;

        return new self(
            $part->id,
            $part->operation,
            $activity->lifecycle,
            $end,
            $part->capture_state->value,
            $activity->elapsedSeconds,
            $activity->bytes,
            $activity->latestLine,
            $position?->reader_revision_id,
            $position === null ? 'no reader' : $position->interpretation->value,
            $assessment?->id,
            $assessment?->outcome->value,
            array_map(fn (OutputProblem $problem) => $problem->code->value, $problems),
            $receiptId,
        );
    }
}
