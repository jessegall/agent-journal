<?php

declare(strict_types=1);

namespace App\Core\Assignments\Support;

use App\Core\Assignments\Enums\AssignmentOutcomeKind;

/**
 * What a command did: one outcome for every record it was asked about, and only the actual changes.
 */
final readonly class AssignmentResult
{
    /**
     * @param  list<AssignmentOutcome>  $outcomes
     * @param  list<AssignmentChange>  $changes
     */
    public function __construct(
        public array $outcomes,
        public array $changes,
    ) {}

    public function count(AssignmentOutcomeKind $kind): int
    {
        return count(array_filter($this->outcomes, fn (AssignmentOutcome $outcome) => $outcome->kind === $kind));
    }

    public function hasChanges(): bool
    {
        return $this->changes !== [];
    }
}
