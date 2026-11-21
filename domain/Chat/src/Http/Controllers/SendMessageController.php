<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Agents\Contracts\AgentDirectory;
use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\AskMessage;
use Domain\Chat\Data\MessageInput;
use Domain\Chat\Http\Requests\ConversationRequest;
use Illuminate\Http\RedirectResponse;
use Illuminate\Routing\Redirector;

/**
 * Sends the composer's message to the chosen agent through Chat, then returns to Home on that agent (303). Core
 * says whether the agent is visible, Chat whether its stack may take the message; a refusal of either comes back as
 * a form error.
 */
final readonly class SendMessageController
{
    /**
     * Asks from the pair of inboxes the conversation showed, so a send keeps its target even when the window has
     * moved on, and returns to Home with the same agent chosen.
     */
    public function __invoke(
        MessageInput $input,
        AgentDirectory $agents,
        CommandBus $commands,
        Redirector $redirect,
    ): RedirectResponse {
        $agents->visibleAgent($input->agent)->assertRuns($input->expectedSessionId, $input->expectedGeneration);
        $commands->run(new AskMessage($input->sourceInboxId, $input->destinationInboxId, $input->body));
        $window = ConversationRequest::queryFor($input->agent);

        return $redirect->route('home', $window, 303);
    }
}
