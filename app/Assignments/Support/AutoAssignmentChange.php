<?php

declare(strict_types=1);

namespace App\Assignments\Support;

/**
 * What a change of an auto-assignment did: whether anything changed, and the configuration revision it now has.
 */
final readonly class AutoAssignmentChange
{
    public function __construct(
        public bool $changed,
        public int $revision,
    ) {}
}
