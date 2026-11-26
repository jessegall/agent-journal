<?php

declare(strict_types=1);

namespace App\Assignments\Data;

use App\Assignments\AutoAssignmentChange;
use Spatie\LaravelData\Data;

/**
 * What an auto-assignment command did: whether anything changed, and the revision it now has.
 */
final class AutoAssignmentChangeData extends Data
{
    public function __construct(
        public readonly bool $hasChanged,
        public readonly int $revision,
    ) {}

    public static function of(AutoAssignmentChange $change): self
    {
        return new self($change->hasChanged, $change->revision);
    }
}
