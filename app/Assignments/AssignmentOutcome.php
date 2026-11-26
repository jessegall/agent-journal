<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Assignments\Enums\AssignmentOutcomeType;
use App\Support\Assignment;
use App\Support\RecordIdentity;

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
