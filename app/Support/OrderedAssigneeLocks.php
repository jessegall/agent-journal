<?php

declare(strict_types=1);

namespace App\Support;

use App\Contracts\Assignments\AssigneeLocks;
use App\Contracts\Assignments\AssignmentProviders;

/**
 * Takes each assignee's lock through the provider registered for its type, in order of type and id.
 */
final readonly class OrderedAssigneeLocks implements AssigneeLocks
{
    public function __construct(private AssignmentProviders $providers) {}

    public function lockShared(array $assignees): void
    {
        foreach (self::ordered($assignees) as $assignee) {
            $this->providers->assigneeProvider($assignee->type)->requireEligible($assignee);
        }
    }

    public function lockExclusive(array $assignees): void
    {
        foreach (self::ordered($assignees) as $assignee) {
            $this->providers->assigneeProvider($assignee->type)->requireExclusive($assignee);
        }
    }

    /**
     * Each assignee once, ordered by type and id.
     *
     * @param  list<AssigneeIdentity>  $assignees
     * @return list<AssigneeIdentity>
     */
    private static function ordered(array $assignees): array
    {
        $byKey = [];

        foreach ($assignees as $assignee) {
            $byKey["{$assignee->type}:{$assignee->id}"] = $assignee;
        }

        ksort($byKey, SORT_STRING);

        return array_values($byKey);
    }
}
