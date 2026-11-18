<?php

declare(strict_types=1);

namespace App\Http\Data\Assignments;

use App\Assignments\Support\AssignmentHolders;
use App\Assignments\Support\AssignmentOutcome;
use App\Assignments\Support\AssignmentResult;
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

    public static function of(AssignmentResult $result, AssignmentHolders $holders): self
    {
        return new self(
            array_map(fn (AssignmentOutcome $outcome) => new AssignmentOutcomeData(
                RecordHolderData::of($outcome->record, $holders->forRecord($outcome->record)),
                $outcome->type,
            ), $result->outcomes),
            count($result->changes),
        );
    }
}
