<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Commands\AskChatQuestion\AskChatQuestionCommand;
use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Contracts\Sessions\AgentDirectory;
use Domain\Chat\Data\MessageInput;
use Domain\Chat\Support\SentMessageAnswer;
use Illuminate\Http\RedirectResponse;

/**
 * Sends the composer's message to the chosen agent through Chat, once per request key. Core says whether the agent is
 * visible, on every request; whether it still runs the session the user saw is checked when the send first runs, so a
 * repeat of a send that went through answers its message again.
 */
final readonly class SendMessageController
{
    /**
     * Posts in the chat inbox the conversation showed, so a send keeps its room even when the window has moved on,
     * and goes back to the page with the message id flashed, or to Home with the same agent chosen.
     */
    public function __invoke(
        MessageInput $input,
        AgentDirectory $agents,
        CommandBus $commands,
        SentMessageAnswer $answer,
    ): RedirectResponse {
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

        return $answer->to($messageId, $input->agent, $input->inboxId);
    }
}
