<?php

declare(strict_types=1);

namespace Domain\Documents\Http\Controllers;

use App\Commands\Messages\PostChatMessage\PostChatMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\AgentDirectory;
use App\Enums\ActorType;
use App\Support\ActorIdentity;
use Domain\Chat\Commands\OpenPairChat\OpenPairChatCommand;
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
        Redirector $redirect,
    ): RedirectResponse {
        $agent = $agents->visibleAgent($request->agentId());
        $inboxId = $commands->run(new OpenPairChatCommand($agent->agentId));
        $commands->run(new PostChatMessageCommand(
            $inboxId,
            "Please give me feedback on {$request->subject()}.",
            $request->requestKey(),
            null,
            new ActorIdentity(ActorType::Agent, $agent->agentId)->text(),
        ));

        return $redirect->back(303);
    }
}
