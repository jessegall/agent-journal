<?php

declare(strict_types=1);

namespace App\Assignments\Http\Data;

use App\Assignments\Enums\AssignmentOutcomeType;
use Spatie\LaravelData\Data;

/**
 * What one command did to one record: changed it, left it as it was, or skipped it because its work is over, with
 * the holder it has now.
 */
final class AssignmentOutcomeData extends Data
{
    public function __construct(
        public readonly RecordHolderData $record,
        public readonly AssignmentOutcomeType $type,
    ) {}
}
