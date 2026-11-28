<?php

declare(strict_types=1);

namespace Domain\Comments\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Inboxes\Commands\OpenInbox\OpenInboxCommand;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Agents\Agent;
use App\Support\ActorReference;
use Domain\Chat\Contracts\ChatDirectory;
use Domain\Comments\Http\Requests\TellFileCommentRequest;
use Illuminate\Http\RedirectResponse;

/**
 * Tells the agent a comment on a project file is for, in a message in the chat of the user and that agent.
 */
final readonly class TellFileCommentController
{
    #[Dispatches(OpenInboxCommand::class)]
    #[Dispatches(SendMessageCommand::class)]
    public function __invoke(
        TellFileCommentRequest $request,
        ChatDirectory $chats,
        CommandBus $commands,
    ): RedirectResponse {
        $agent = ActorReference::ofClass(Agent::class, $request->agentId());
        $inboxId = $chats->pairWith($agent);
        $commands->run($request->command($inboxId));

        return back();
    }
}
