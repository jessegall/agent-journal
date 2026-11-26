<?php

declare(strict_types=1);

namespace App\Assignments;

use App\Support\Assignment;
use App\Support\RecordIdentity;

/**
 * One record whose holder actually changed, with its assignment before and after.
 */
final readonly class AssignmentChange
{
    public function __construct(
        public RecordIdentity $record,
        public Assignment|null $before,
        public Assignment|null $after,
    ) {}
}
