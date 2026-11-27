<?php

declare(strict_types=1);

namespace App\Assignments\Data;

use App\Assignments\AssignmentOutcome;
use App\Assignments\Contracts\AssigneeResolver;
use App\Support\AssignmentHolders;
use App\Support\AssignmentResult;
use Spatie\LaravelData\Attributes\DataCollectionOf;
use Spatie\LaravelData\Data;

/**
 * The answer to an assignment command: every record it covered with what happened to it, and how many changed. A
 * single-record command changes nothing under the record.
 */
final class AssignmentResultData extends Data
{
    /**
     * @param  list<AssignmentOutcomeData>  $outcomes
     */
    public function __construct(
        #[DataCollectionOf(AssignmentOutcomeData::class)]
        public readonly array $outcomes,
        public readonly int $changed,
    ) {}

    /**
     * The change with the current holder of each record it touched.
     */
    public static function withHolders(AssignmentResult $change, AssigneeResolver $assignees): self
    {
        return self::of($change, $assignees->holdersOf($change->currentAssignments()));
    }

    public static function of(AssignmentResult $change, AssignmentHolders $holders): self
    {
        return new self(
            array_map(fn (AssignmentOutcome $outcome) => new AssignmentOutcomeData(
                RecordHolderData::of($outcome->record, $holders->forRecord($outcome->record)),
                $outcome->type,
            ), $change->outcomes),
            count($change->changes),
        );
    }
}
