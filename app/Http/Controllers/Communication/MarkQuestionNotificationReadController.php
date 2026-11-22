<?php

declare(strict_types=1);

namespace App\Http\Controllers\Communication;

use App\Contracts\CommandBus;
use App\Contracts\CurrentActor;
use App\Http\Requests\Communication\MarkQuestionNotificationReadRequest;
use App\Resolvers\Support\NotificationFeed;
use App\Support\ActorIdentity;
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
