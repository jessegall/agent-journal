<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\AnswerChatQuestionCall;
use App\Calls\Communication\MessageNamed;
use App\Commands\AnswerChatQuestion\AnswerChatQuestionCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Answers a waiting chat question and closes it.
 */
final readonly class AnswerChatQuestionController
{
    public function __invoke(AnswerChatQuestionCall $call, CommandBus $commands): MessageNamed
    {
        $replyId = $commands->run(new AnswerChatQuestionCommand(
            $call->questionId,
            $call->body,
            $call->requestKey->value,
            $call->claimToken,
        ));

        return MessageNamed::from(['messageId' => $replyId]);
    }
}
