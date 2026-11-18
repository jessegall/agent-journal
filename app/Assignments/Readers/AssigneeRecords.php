<?php

declare(strict_types=1);

namespace App\Assignments\Readers;

use App\Actors\Enums\ActorType;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Contracts\AssigneeReader;
use App\Assignments\Contracts\AssignmentProviders;
use App\Assignments\Contracts\AssignmentReader;
use App\Assignments\Support\AssigneeList;
use App\Assignments\Support\AssigneeName;
use App\Assignments\Support\Assignment;
use App\Assignments\Support\AssignmentHolder;
use App\Assignments\Support\AssignmentHolders;
use App\Assignments\Support\AssignmentSet;
use App\Assignments\Support\Page;
use App\Records\Support\RecordIdentity;

/**
 * Reads actors' names and eligible actors through the owner of each actor type, one call per type.
 */
final readonly class AssigneeRecords implements AssigneeReader
{
    public function __construct(private AssignmentProviders $providers, private AssignmentReader $assignments) {}

    /**
     * @param  list<ActorIdentity>  $actors
     * @return list<AssigneeName>
     */
    public function names(array $actors): array
    {
        $names = [];

        foreach (array_unique(array_map(fn (ActorIdentity $actor) => $actor->type, $actors), SORT_REGULAR) as $type) {
            array_push($names, ...$this->providers->assigneeProvider($type)->names(array_values(array_filter($actors, fn (ActorIdentity $actor) => $actor->type === $type))));
        }

        return $names;
    }

    public function eligible(ActorType $type, Page $page): AssigneeList
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
        $names = $this->names(array_map(fn (Assignment $assignment) => $assignment->holder(), $assignments->assignments));
        $holders = [];

        foreach ($assignments->assignments as $assignment) {
            foreach ($names as $name) {
                if ($name->actor->isSameAs($assignment->holder())) {
                    $holders[] = new AssignmentHolder($assignment, $name->name);
                }
            }
        }

        return new AssignmentHolders($holders);
    }
}
