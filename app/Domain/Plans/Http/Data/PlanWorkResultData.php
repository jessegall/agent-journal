<?php

declare(strict_types=1);

namespace App\Domain\Plans\Http\Data;

use App\Core\Assignments\Enums\AssignmentOutcomeType;
use App\Core\Assignments\Http\Data\RecordHolderData;
use App\Core\Assignments\Support\AssignmentHolders;
use App\Core\Assignments\Support\AssignmentResult;
use App\Core\Assignments\Support\RecordIdentity;
use Spatie\LaravelData\Data;

/**
 * The answer to a plan or phase cascade: the root with its holder now, and how many records under it changed, stayed
 * as they were, or were skipped because their work is over. It names no record under the root.
 */
final class PlanWorkResultData extends Data
{
    public function __construct(
        public readonly bool $cascade,
        public readonly RecordHolderData $root,
        public readonly int $changed,
        public readonly int $unchanged,
        public readonly int $skipped,
    ) {}

    public static function of(RecordIdentity $root, AssignmentResult $result, AssignmentHolders $holders): self
    {
        return new self(
            true,
            RecordHolderData::of($root, $holders->forRecord($root)),
            $result->count(AssignmentOutcomeType::Changed),
            $result->count(AssignmentOutcomeType::Unchanged),
            $result->count(AssignmentOutcomeType::SkippedFinished),
        );
    }
}
