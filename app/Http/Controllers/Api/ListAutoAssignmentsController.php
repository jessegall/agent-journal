<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Actors\Contracts\CurrentActor;
use App\Api\Assignments\ListAutoAssignmentsPayload;
use App\Assignments\Contracts\AutoAssignmentAccess;
use App\Assignments\Contracts\AutoAssignmentResolver;
use App\Assignments\Data\AutoAssignmentPageData;
use App\Support\ActorReference;
use App\Support\IdListPage;

/**
 * Lists an actor's auto-assignments to whoever may read them.
 */
final readonly class ListAutoAssignmentsController
{
    public function __invoke(
        ListAutoAssignmentsPayload $call,
        CurrentActor $actors,
        AutoAssignmentAccess $access,
        AutoAssignmentResolver $assignments,
    ): AutoAssignmentPageData {
        $actor = ActorReference::fromStored($call->actorType, strtolower($call->actorId));
        $access->assertMayRead($actors->actor(), $actor);
        $page = new IdListPage($call->after === null ? null : strtolower($call->after));

        return AutoAssignmentPageData::of($assignments->listFor($actor, $page));
    }
}
