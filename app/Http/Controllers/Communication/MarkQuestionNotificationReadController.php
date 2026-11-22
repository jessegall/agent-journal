<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Actors\Contracts\CurrentActor;
use App\Actors\Support\ActorIdentity;
use App\Bus\Contracts\CommandBus;
use App\Communication\Resolvers\NotificationFeed;
use App\Http\Requests\Communication\MarkQuestionNotificationReadRequest;
use Illuminate\Http\JsonResponse;

/**
 * Marks the actor's receipt of one shown question read and answers the refreshed newest page.
 */
final readonly class MarkQuestionNotificationReadController
{
    public function __invoke(
        MarkQuestionNotificationReadRequest $request,
        CommandBus $commands,
        NotificationFeed $feed,
        CurrentActor $actors,
    ): JsonResponse {
        $commands->run($request->command());

        return new JsonResponse($feed->page(ActorIdentity::of($actors->actor()), null));
    }
}
