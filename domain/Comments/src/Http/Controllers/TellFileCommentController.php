<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Controllers;

use App\Contracts\Bus\CommandBus;
use App\Models\Agents\Agent;
use App\Support\ActorIdentity;
use Domain\Chat\Contracts\PairChats;
use Domain\Comments\Http\Requests\TellFileCommentRequest;
use Illuminate\Http\RedirectResponse;

/**
 * Tells the agent a comment on a project file is for, in a message in the chat of the user and that agent.
 */
final readonly class TellFileCommentController
{
    public function __invoke(
        TellFileCommentRequest $request,
        PairChats $chats,
        CommandBus $commands,
    ): RedirectResponse {
        $agent = ActorIdentity::ofClass(Agent::class, $request->agentId());
        $inboxId = $chats->pairWith($agent);
        $commands->run($request->command($inboxId));

        return back();
    }
}
