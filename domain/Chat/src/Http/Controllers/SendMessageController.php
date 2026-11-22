<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Commands\AskChatQuestion\AskChatQuestionCommand;
use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Contracts\AgentDirectory;
use App\Contracts\CommandBus;
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
     * Posts in the chat inbox the conversation showed, so a send keeps its room even when the window has moved on,
     * and answers with its message or returns to Home with the same agent chosen.
     */
    public function __invoke(
        MessageInput $input,
        Request $request,
        AgentDirectory $agents,
        CommandBus $commands,
        SentMessageAnswer $answer,
    ): JsonResponse|RedirectResponse {
        if ($input->agent !== null) {
            $agents->visibleAgent($input->agent)->assertRuns($input->expectedSessionId, $input->expectedGeneration);
        }

        $messageId = $input->question
            ? $commands->run(new AskChatQuestionCommand(
                $input->inboxId,
                $input->body,
                $input->requestKey,
                $input->addressee,
            ))
            : $commands->run(new PostChatMessageCommand(
                $input->inboxId,
                $input->body,
                $input->requestKey,
                null,
                $input->addressee,
            ));

        return $answer->to($request, $messageId, $input->agent, $input->inboxId);
    }
}
