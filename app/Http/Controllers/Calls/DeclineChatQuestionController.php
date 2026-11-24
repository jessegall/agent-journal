<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\DeclineChatQuestionCall;
use App\Calls\Communication\MessageNamed;
use App\Commands\Messages\DeclineChatQuestion\DeclineChatQuestionCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Declines a waiting chat question with a reason.
 */
final readonly class DeclineChatQuestionController
{
    public function __invoke(DeclineChatQuestionCall $call, CommandBus $commands): MessageNamed
    {
        $commands->run(new DeclineChatQuestionCommand($call->questionId, $call->reason, $call->claimToken));

        return MessageNamed::from(['messageId' => $call->questionId]);
    }
}
