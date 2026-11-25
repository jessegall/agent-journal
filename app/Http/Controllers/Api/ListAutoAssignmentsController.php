<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Assignments\ListAutoAssignmentsPayload;
use App\Contracts\Actors\CurrentActor;
use App\Contracts\Assignments\AutoAssignmentAccess;
use App\Contracts\Assignments\AutoAssignmentResolver;
use App\Data\Assignments\AutoAssignmentPageData;
use App\Support\ActorIdentity;
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
        $actor = ActorIdentity::fromStored($call->actorType, strtolower($call->actorId));
        $access->assertMayRead($actors->actor(), $actor);
        $page = new IdListPage($call->after === null ? null : strtolower($call->after));

        return AutoAssignmentPageData::of($assignments->listFor($actor, $page));
    }
}
