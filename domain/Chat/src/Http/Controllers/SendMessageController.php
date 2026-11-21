<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Agents\Contracts\AgentDirectory;
use App\Agents\Values\SeenSession;
use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\AskMessage;
use Domain\Chat\Data\MessageInput;
use Domain\Chat\Support\SentMessageAnswer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Sends the composer's message to the chosen agent through Chat, once per request key. Core says whether the agent is
 * visible, on every request; whether it still runs the session the user saw is checked when the send first runs, so a
 * repeat of a send that went through answers its message again.
 */
final readonly class SendMessageController
{
    /**
     * Asks from the pair of inboxes the conversation showed, so a send keeps its target even when the window has
     * moved on, and answers with its message or returns to Home with the same agent chosen.
     */
    public function __invoke(
        MessageInput $input,
        Request $request,
        AgentDirectory $agents,
        CommandBus $commands,
        SentMessageAnswer $answer,
    ): JsonResponse|RedirectResponse {
        $agents->visibleAgent($input->agent);

        $messageId = $commands->run(new AskMessage(
            $input->sourceInboxId,
            $input->destinationInboxId,
            $input->body,
            new SeenSession($input->agent, $input->expectedSessionId, $input->expectedGeneration),
        ));

        return $answer->to($request, $messageId, $input->agent);
    }
}
