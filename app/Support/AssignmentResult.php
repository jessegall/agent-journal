<?php

declare(strict_types=1);

namespace App\Support;

use App\Enums\AssignmentOutcomeType;

/**
 * What a command did: one outcome for every record it was asked about, and only the actual changes.
 */
final readonly class AssignmentResult
{
    /**
     * @param  list<AssignmentOutcome>  $outcomes
     * @param  list<AssignmentChange>  $changes
     * @param  list<AssignmentRequest>  $requests
     */
    public function __construct(
        public array $outcomes,
        public array $changes,
        public array $requests = [],
    ) {}

    /**
     * The same result, naming who the request asked for and who holds the work.
     */
    public function forRequest(AssignmentRequest $request): self
    {
        return new self($this->outcomes, $this->changes, [
            ...$this->requests,
            $request,
        ]);
    }

    public function count(AssignmentOutcomeType $type): int
    {
        return count(array_filter($this->outcomes, fn (AssignmentOutcome $outcome) => $outcome->type === $type));
    }

    public function hasChanges(): bool
    {
        return $this->changes !== [];
    }

    /**
     * @param  list<self>  $batches
     */
    public static function combined(array $batches): self
    {
        return new self(
            array_merge(...array_map(fn (self $assignmentBatch) => $assignmentBatch->outcomes, $batches)),
            array_merge(...array_map(fn (self $assignmentBatch) => $assignmentBatch->changes, $batches)),
            array_merge(...array_map(fn (self $assignmentBatch) => $assignmentBatch->requests, $batches)),
        );
    }

    /**
     * The assignments the covered records have after the command.
     */
    public function currentAssignments(): AssignmentSet
    {
        return new AssignmentSet(
            array_values(
                array_filter(array_map(fn (AssignmentOutcome $outcome) => $outcome->current, $this->outcomes)),
            ),
        );
    }
}
