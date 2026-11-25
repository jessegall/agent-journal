<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Attributes\Bus\Dispatches;
use App\Commands\Inboxes\OpenInbox\OpenInboxCommand;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\AgentDirectory;
use App\Models\Agents\Agent;
use App\Support\ActorReference;
use Domain\Chat\Contracts\PairChats;
use Domain\Documents\Http\Requests\DocumentFeedbackRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Asks an agent the reader may see for feedback on a document, or on lines of it, with a message in their chat.
 */
final readonly class AskDocumentFeedbackPageController
{
    #[Dispatches(OpenInboxCommand::class)]
    #[Dispatches(SendMessageCommand::class)]
    public function __invoke(
        DocumentFeedbackRequest $request,
        AgentDirectory $agents,
        CommandBus $commands,
        PairChats $chats,
        Redirector $redirect,
    ): RedirectResponse {
        $agent = $agents->visibleAgent($request->agentId());
        $inboxId = $chats->pairWith(ActorReference::ofClass(Agent::class, $agent->agentId));
        $commands->run(new SendMessageCommand($inboxId, "Please give me feedback on {$request->subject()}."));

        return $redirect->back(303);
    }
}
