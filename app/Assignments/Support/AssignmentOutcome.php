<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Enums\AssignmentOutcomeType;
use PhpOption\Option;

/**
 * What a command did to one record it was asked about, with the record's assignment afterwards.
 */
final readonly class AssignmentOutcome
{
    /**
     * @param  Option<Assignment>  $current
     */
    public function __construct(
        public RecordIdentity $record,
        public Option $current,
        public AssignmentOutcomeType $type,
    ) {}
}
