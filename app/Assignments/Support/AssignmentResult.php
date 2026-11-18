<?php

declare(strict_types=1);

namespace App\Assignments\Support;

use App\Assignments\Enums\AssignmentOutcomeType;

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

    public function count(AssignmentOutcomeType $type): int
    {
        return count(array_filter($this->outcomes, fn (AssignmentOutcome $outcome) => $outcome->type === $type));
    }

    public function hasChanges(): bool
    {
        return $this->changes !== [];
    }

    /**
     * @param  list<self>  $results
     */
    public static function combined(array $results): self
    {
        return new self(
            array_merge(...array_map(fn (self $result) => $result->outcomes, $results)),
            array_merge(...array_map(fn (self $result) => $result->changes, $results)),
        );
    }

    /**
     * The assignments the covered records have after the command.
     */
    public function currentAssignments(): AssignmentSet
    {
        return new AssignmentSet(array_values(array_filter(array_map(fn (AssignmentOutcome $outcome) => $outcome->current, $this->outcomes))));
    }
}
