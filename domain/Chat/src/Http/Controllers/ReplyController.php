<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Bus\Contracts\CommandBus;
use App\Communication\Commands\AnswerChatQuestion;
use App\Communication\Commands\ReplyInChat;
use App\Communication\Contracts\ConversationResolver;
use App\Communication\Enums\MessageState;
use Domain\Chat\Data\ReplyInput;
use Domain\Chat\Support\SentMessageAnswer;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;

/**
 * Replies from the chat once per request key, bound to the message, the version shown, the text and the agent.
 */
final readonly class ReplyController
{
    /**
     * Replies in the message's own chat; a question waiting for an answer is answered and closed by it.
     */
    public function __invoke(
        ReplyInput $input,
        Request $request,
        CommandBus $commands,
        ConversationResolver $messages,
        SentMessageAnswer $answer,
    ): JsonResponse|RedirectResponse {
        $parent = $messages->detail($input->messageId);

        $replyId = $parent->state === MessageState::WaitingForAnswer
            ? $commands->run(new AnswerChatQuestion($input->messageId, $input->body, $input->requestKey))
            : $commands->run(new ReplyInChat($input->messageId, $input->body, $input->requestKey, $input->inboxId));

        return $answer->to($request, $replyId, $input->agent);
    }
}
