<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Communication\Resolvers\NotificationChanges;
use App\Http\Requests\Communication\NotificationChangesRequest;
use Illuminate\Http\JsonResponse;

final readonly class NotificationChangesController
{
    public function __invoke(
        NotificationChangesRequest $request,
        NotificationChanges $changes,
        CurrentActor $actors,
    ): JsonResponse {
        return new JsonResponse($changes->since(ActorIdentity::of($actors->actor()), $request->since()));
    }
}
