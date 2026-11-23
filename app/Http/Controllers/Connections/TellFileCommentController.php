<?php

declare(strict_types=1);

namespace App\Http\Controllers\Connections;

use App\Contracts\Actors\CurrentActor;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Chat\InboxDestinationResolver;
use App\Enums\ActorType;
use App\Http\Requests\Connections\TellFileCommentRequest;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use Illuminate\Http\RedirectResponse;

/**
 * Tells the agent a comment on a project file is for, in the chat, once the comment is saved.
 */
final readonly class TellFileCommentController
{
    public function __invoke(
        TellFileCommentRequest $request,
        InboxDestinationResolver $inboxes,
        CurrentActor $actors,
        CommandBus $commands,
    ): RedirectResponse {
        $user = AssigneeIdentity::of($actors->actor());
        $agent = AssigneeIdentity::ofActorIdentity(new ActorIdentity(ActorType::Agent, $request->agentId()));

        $commands->run($request->command($inboxes->resolve($user)->inboxId(), $inboxes->resolve($agent)->inboxId()));

        return back();
    }
}
