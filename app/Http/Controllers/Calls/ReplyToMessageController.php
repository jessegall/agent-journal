<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessageNamed;
use App\Calls\Communication\ReplyToMessageCall;
use App\Commands\ReplyToMessage\ReplyToMessageCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Replies to a message as the state you read.
 */
final readonly class ReplyToMessageController
{
    public function __invoke(ReplyToMessageCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(
            new ReplyToMessageCommand($call->messageId, $call->expectedStateVersion, $call->body),
        );

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
