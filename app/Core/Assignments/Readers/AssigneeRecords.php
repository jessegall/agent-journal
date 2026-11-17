<?php

declare(strict_types=1);

namespace App\Core\Assignments\Readers;

use App\Core\Actors\Enums\ActorKind;
use App\Core\Actors\Support\ActorIdentity;
use App\Core\Assignments\Contracts\AssigneeReader;
use App\Core\Assignments\Contracts\AssignmentProviders;
use App\Core\Assignments\Support\AssigneeList;
use App\Core\Assignments\Support\AssigneeName;
use App\Core\Assignments\Support\Assignment;
use App\Core\Assignments\Support\AssignmentHolder;
use App\Core\Assignments\Support\AssignmentHolders;
use App\Core\Assignments\Support\AssignmentSet;
use App\Core\Assignments\Support\Page;

/**
 * Reads actors' names and eligible actors through the owner of each actor kind, one call per kind.
 */
final readonly class AssigneeRecords implements AssigneeReader
{
    public function __construct(private AssignmentProviders $providers) {}

    /**
     * @param  list<ActorIdentity>  $actors
     * @return list<AssigneeName>
     */
    public function names(array $actors): array
    {
        $names = [];

        foreach (array_unique(array_map(fn (ActorIdentity $actor) => $actor->kind, $actors), SORT_REGULAR) as $kind) {
            array_push($names, ...$this->providers->assigneeProvider($kind)->names(array_values(array_filter($actors, fn (ActorIdentity $actor) => $actor->kind === $kind))));
        }

        return $names;
    }

    public function eligible(ActorKind $kind, Page $page): AssigneeList
    {
        return $this->providers->assigneeProvider($kind)->eligible($page);
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
