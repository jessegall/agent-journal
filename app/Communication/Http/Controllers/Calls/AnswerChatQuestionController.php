<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\AnswerChatQuestionCall;
use App\Communication\Calls\MessageNamed;
use App\Communication\Commands\AnswerChatQuestion;

/**
 * Answers a waiting chat question and closes it.
 */
final readonly class AnswerChatQuestionController
{
    public function __invoke(AnswerChatQuestionCall $call, CommandBus $commands): MessageNamed
    {
        $replyId = $commands->run(new AnswerChatQuestion(
            $call->questionId,
            $call->body,
            $call->requestKey->value,
            $call->claimToken,
        ));

        return MessageNamed::from(['messageId' => $replyId]);
    }
}
