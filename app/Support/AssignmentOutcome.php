<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\Assignments\AssignmentOutcomeType;

/**
 * What a command did to one record it was asked about, with the record's assignment afterwards.
 */
final readonly class AssignmentOutcome
{
    public function __construct(
        public RecordIdentity $record,
        public Assignment|null $current,
        public AssignmentOutcomeType $type,
    ) {}
}
