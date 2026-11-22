<?php

declare(strict_types=1);

namespace App\Resolvers;

use App\Contracts\AssigneeResolver;
use App\Contracts\AssignmentProviders;
use App\Contracts\AssignmentResolver;
use App\Support\AssigneeIdentity;
use App\Support\AssigneeList;
use App\Support\AssigneeName;
use App\Support\Assignment;
use App\Support\AssignmentHolder;
use App\Support\AssignmentHolders;
use App\Support\AssignmentSet;
use App\Support\Page;
use App\Support\RecordIdentity;

/**
 * Reads actors' names and eligible actors through the owner of each actor type, one call per type.
 */
final readonly class AssigneeRecords implements AssigneeResolver
{
    public function __construct(private AssignmentProviders $providers, private AssignmentResolver $assignments) {}

    /**
     * @param  list<AssigneeIdentity>  $actors
     * @return list<AssigneeName>
     */
    public function names(array $actors): array
    {
        $names = [];

        foreach (array_unique(
            array_map(fn (AssigneeIdentity $actor) => $actor->type, $actors),
            SORT_REGULAR,
        ) as $type) {
            array_push(
                $names,
                ...$this->providers->assigneeProvider($type)->names(
                    array_values(array_filter($actors, fn (AssigneeIdentity $actor) => $actor->type === $type)),
                ),
            );
        }

        return $names;
    }

    public function eligible(string $type, Page $page): AssigneeList
    {
        return $this->providers->assigneeProvider($type)->eligible($page);
    }

    /**
     * @param  list<RecordIdentity>  $records
     */
    public function holdersOfRecords(array $records): AssignmentHolders
    {
        return $this->holdersOf($this->assignments->assignmentsFor($records));
    }

    public function holdersOf(AssignmentSet $assignments): AssignmentHolders
    {
        $names = $this->names(
            array_map(fn (Assignment $assignment) => $assignment->holder(), $assignments->assignments),
        );

        $holders = [];

        foreach ($assignments->assignments as $assignment) {
            foreach ($names as $name) {
                if ($name->assignee->isSameAs($assignment->holder())) {
                    $holders[] = new AssignmentHolder($assignment, $name->name);
                }
            }
        }

        return new AssignmentHolders($holders);
    }
}
