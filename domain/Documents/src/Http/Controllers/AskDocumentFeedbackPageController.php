<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\AgentDirectory;
use App\Enums\Assignments\ActorType;
use App\Support\ActorIdentity;
use Domain\Chat\Contracts\PairChats;
use Domain\Documents\Http\Requests\DocumentFeedbackRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Asks an agent the reader may see for feedback on a document, or on lines of it, with a message in their chat.
 */
final readonly class AskDocumentFeedbackPageController
{
    public function __invoke(
        DocumentFeedbackRequest $request,
        AgentDirectory $agents,
        CommandBus $commands,
        PairChats $chats,
        Redirector $redirect,
    ): RedirectResponse {
        $agent = $agents->visibleAgent($request->agentId());
        $inboxId = $chats->pairWith(new ActorIdentity(ActorType::Agent, $agent->agentId));
        $commands->run(new SendMessageCommand($inboxId, "Please give me feedback on {$request->subject()}."));

        return $redirect->back(303);
    }
}
