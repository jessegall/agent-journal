<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\DeclineChatQuestionCall;
use App\Communication\Calls\MessageNamed;
use App\Communication\Commands\DeclineChatQuestion;

/**
 * Declines a waiting chat question with a reason.
 */
final readonly class DeclineChatQuestionController
{
    public function __invoke(DeclineChatQuestionCall $call, CommandBus $commands): MessageNamed
    {
        $commands->run(new DeclineChatQuestion($call->questionId, $call->reason, $call->claimToken));

        return MessageNamed::from(['messageId' => $call->questionId]);
    }
}
