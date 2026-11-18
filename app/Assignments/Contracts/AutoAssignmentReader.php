<?php

declare(strict_types=1);

namespace App\Assignments\Contracts;

use App\Actors\Support\ActorIdentity;
use App\Assignments\Support\AutoAssignmentFact;
use App\Assignments\Support\AutoAssignmentKey;
use App\Assignments\Support\AutoAssignmentPage;
use App\Assignments\Support\Page;
use PhpOption\Option;

/**
 * Reads the stored auto-assignments; a read never creates one.
 */
interface AutoAssignmentReader
{
    /**
     * The actor's auto-assignment of the type; none when it was never enabled.
     *
     * @return Option<AutoAssignmentFact>
     */
    public function forActor(AutoAssignmentKey $key): Option;

    /**
     * One page of the auto-assignments that are on, by id, for the engine's maintenance only.
     */
    public function enabled(Page $page): AutoAssignmentPage;

    /**
     * One page of the actor's auto-assignments, on or off, by id.
     */
    public function listFor(ActorIdentity $actor, Page $page): AutoAssignmentPage;
}
