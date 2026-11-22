<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\AnswerMessageCall;
use App\Communication\Calls\MessageNamed;
use App\Communication\Commands\AnswerMessage\AnswerMessageCommand;

final readonly class AnswerMessageController
{
    public function __invoke(AnswerMessageCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new AnswerMessageCommand($call->messageId, $call->replyId));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
