<?php

declare(strict_types=1);

namespace App\Events;

/**
 * These assignments ended: released, replaced by a new one, or removed with the claim they proved. Raised once the
 * change has committed, so a reader holding any of them knows it no longer stands.
 */
final readonly class AssignmentsEnded extends AssignmentEvent
{
    /**
     * @param  list<string>  $assignmentIds
     */
    public function __construct(public array $assignmentIds) {}

    /**
     * Whether any of these assignments ended.
     *
     * @param  list<string>  $ids
     */
    public function endsAnyOf(array $ids): bool
    {
        return array_intersect($this->assignmentIds, $ids) !== [];
    }
}
