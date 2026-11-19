<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessageNamed;
use App\Communication\Calls\ReplyToMessageCall;
use App\Communication\Commands\ReplyToMessage;

/**
 * Replies to a message as the state you read.
 */
final readonly class ReplyToMessageController
{
    public function __invoke(ReplyToMessageCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new ReplyToMessage($call->messageId, $call->expectedStateVersion, $call->body));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
