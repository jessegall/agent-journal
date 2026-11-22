<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\AskChatQuestionCall;
use App\Calls\Communication\MessageNamed;
use App\Commands\AskChatQuestion\AskChatQuestionCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Asks a question in one of your chats.
 */
final readonly class AskChatQuestionController
{
    public function __invoke(AskChatQuestionCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new AskChatQuestionCommand(
            $call->inboxId,
            $call->body,
            $call->requestKey->value,
            $call->respondent,
            $call->claimToken,
        ));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
