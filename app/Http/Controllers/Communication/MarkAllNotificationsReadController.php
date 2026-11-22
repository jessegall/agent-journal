<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CommandBus;
use App\Contracts\CurrentActor;
use App\Http\Requests\Communication\MarkAllNotificationsReadRequest;
use App\Resolvers\Support\NotificationFeed;
use App\Support\ActorIdentity;
use Illuminate\Http\JsonResponse;

/**
 * Marks every unread receipt up to the watermark the reader saw, one batch per command so each holds its scope's
 * lock only briefly, and answers the refreshed newest page once all are done.
 */
final readonly class MarkAllNotificationsReadController
{
    public function __invoke(
        MarkAllNotificationsReadRequest $request,
        CommandBus $commands,
        NotificationFeed $feed,
        CurrentActor $actors,
    ): JsonResponse {
        do {
            $isDone = $commands->run($request->command());
        } while (! $isDone);

        return new JsonResponse($feed->page(ActorIdentity::of($actors->actor()), null));
    }
}
