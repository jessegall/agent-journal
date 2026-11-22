<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CurrentActor;
use App\Http\Requests\Communication\NotificationPageRequest;
use App\Resolvers\Support\NotificationFeed;
use App\Support\ActorIdentity;
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
