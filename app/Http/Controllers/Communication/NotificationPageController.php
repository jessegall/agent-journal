<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Communication\Resolvers\NotificationFeed;
use App\Http\Requests\Communication\NotificationPageRequest;
use Illuminate\Http\JsonResponse;

final readonly class NotificationPageController
{
    public function __invoke(
        NotificationPageRequest $request,
        NotificationFeed $feed,
        CurrentActor $actors,
    ): JsonResponse {
        return new JsonResponse($feed->page(ActorIdentity::of($actors->actor()), $request->cursor()));
    }
}
