<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\AnswerMessageCall;
use App\Calls\Communication\MessageNamed;
use App\Commands\AnswerMessage\AnswerMessageCommand;
use App\Contracts\Bus\CommandBus;

final readonly class AnswerMessageController
{
    public function __invoke(AnswerMessageCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new AnswerMessageCommand($call->messageId, $call->replyId));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
