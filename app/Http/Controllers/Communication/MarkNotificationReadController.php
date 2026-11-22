<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CommandBus;
use App\Contracts\CurrentActor;
use App\Http\Requests\Communication\MarkNotificationReadRequest;
use App\Resolvers\Support\NotificationFeed;
use App\Support\ActorIdentity;
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
