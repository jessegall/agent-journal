<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Communication\Resolvers\Support\NotificationFeed;
use App\Http\Requests\Communication\MarkNotificationReadRequest;
use Illuminate\Http\JsonResponse;

/**
 * Marks one receipt read and answers the refreshed newest page, so the client takes the server's count.
 */
final readonly class MarkNotificationReadController
{
    public function __invoke(
        MarkNotificationReadRequest $request,
        CommandBus $commands,
        NotificationFeed $feed,
        CurrentActor $actors,
    ): JsonResponse {
        $commands->run($request->command());

        return new JsonResponse($feed->page(ActorIdentity::of($actors->actor()), null));
    }
}
