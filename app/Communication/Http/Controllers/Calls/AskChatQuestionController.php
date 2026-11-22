<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessageNamed;
use App\Communication\Calls\AskChatQuestionCall;
use App\Communication\Commands\AskChatQuestion;

/**
 * Asks a question in one of your chats.
 */
final readonly class AskChatQuestionController
{
    public function __invoke(AskChatQuestionCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new AskChatQuestion($call->inboxId, $call->body, $call->requestKey->value, $call->respondent));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
