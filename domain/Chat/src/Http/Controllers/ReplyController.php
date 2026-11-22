<?php

declare(strict_types=1);

namespace Domain\Chat\Http\Controllers;

use App\Commands\ReplyInChat\ReplyInChatCommand;
use App\Contracts\Bus\CommandBus;
use Domain\Chat\Data\ReplyInput;
use Domain\Chat\Support\SentMessageAnswer;
use Illuminate\Http\RedirectResponse;

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
        CommandBus $commands,
        SentMessageAnswer $answer,
    ): RedirectResponse {
        $replyId = $commands->run(new ReplyInChatCommand($input->messageId, $input->body, $input->requestKey, $input->inboxId));

        return $answer->to($replyId, $input->agent, $input->inboxId);
    }
}
