<?php

declare(strict_types=1);

namespace App\Http\Controllers\Connections;

use App\Contracts\Bus\CommandBus;
use App\Contracts\Inboxes\InboxDestinationResolver;
use App\Http\Requests\Connections\TellFileCommentRequest;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use App\Support\AssigneeIdentity;
use Illuminate\Http\RedirectResponse;

/**
 * Tells the agent a comment on a project file is for, in a message, once the comment is saved.
 */
final readonly class TellFileCommentController
{
    public function __invoke(
        TellFileCommentRequest $request,
        InboxDestinationResolver $inboxes,
        CommandBus $commands,
    ): RedirectResponse {
        $agent = AssigneeIdentity::ofActorIdentity(ActorIdentity::ofClass(Agent::class, $request->agentId()));

        $commands->run($request->command($inboxes->resolve($agent)->inboxId()));

        return back();
    }
}
