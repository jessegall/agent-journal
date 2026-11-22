<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CurrentActor;
use App\Http\Requests\Communication\NotificationChangesRequest;
use App\Resolvers\Support\NotificationChanges;
use App\Support\ActorIdentity;
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
