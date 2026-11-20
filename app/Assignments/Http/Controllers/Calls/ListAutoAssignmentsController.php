<?php

declare(strict_types=1);

namespace App\Assignments\Http\Controllers\Calls;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Assignments\Calls\ListAutoAssignmentsCall;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Support\Page;
use App\Http\Data\Assignments\AutoAssignmentPageData;

/**
 * Lists an actor's auto-assignments to whoever may read them.
 */
final readonly class ListAutoAssignmentsController
{
    public function __invoke(
        ListAutoAssignmentsCall $call,
        CurrentActor $actors,
        AutoAssignmentAccess $access,
        AutoAssignmentResolver $autoAssignments,
    ): AutoAssignmentPageData {
        $actor = new ActorIdentity($call->actorType, strtolower($call->actorId));
        $access->assertMayRead($actors->actor(), $actor);
        $page = new Page($call->after === null ? null : strtolower($call->after));

        return AutoAssignmentPageData::of($autoAssignments->listFor($actor, $page));
    }
}
