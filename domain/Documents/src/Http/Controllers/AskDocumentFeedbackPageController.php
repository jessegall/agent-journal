<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Inboxes\Commands\OpenInbox\OpenInboxCommand;
use App\Messages\Commands\SendMessage\SendMessageCommand;
use App\Models\Agents\Agent;
use App\Sessions\Contracts\AgentDirectory;
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
