<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Assignments\AutoAssignmentView;
use App\Assignments\Exceptions\AutoAssignmentDenied;
use App\Exceptions\AssignmentDenied;
use App\Support\ActorReference;
use App\Support\AutoAssignmentFact;
use App\Support\AutoAssignmentKey;
use App\Support\CursorPage;
use App\Support\IdListPage;
use PhpOption\Option;

/**
 * Reads the stored auto-assignments; a read never creates one.
 */
interface AutoAssignmentResolver
{
    /**
     * The actor's auto-assignment of the type; none when it was never enabled.
     *
     * @return Option<AutoAssignmentFact>
     */
    public function forActor(AutoAssignmentKey $key): Option;

    /**
     * Where the actor's auto-assignment of the type stands now, for a reader allowed to read it; totals only when the
     * reader may see them.
     *
     * @throws AutoAssignmentDenied
     * @throws AssignmentDenied
     */
    public function status(AutoAssignmentKey $key): AutoAssignmentView;

    /**
     * One page of the auto-assignments that are on, by id, for the engine's maintenance only.
     *
     * @return CursorPage<AutoAssignmentFact>
     */
    public function enabled(IdListPage $page): CursorPage;

    /**
     * One page of the actor's auto-assignments, on or off, by id.
     *
     * @return CursorPage<AutoAssignmentFact>
     */
    public function listFor(ActorReference $actor, IdListPage $page): CursorPage;
}
