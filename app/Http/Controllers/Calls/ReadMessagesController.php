<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessagesRead;
use App\Calls\Communication\ReadMessagesCall;
use App\Commands\ReadMessages\ReadMessagesCommand;
use App\Contracts\CommandBus;
use App\Data\MessageReadResult;

/**
 * Marks messages of an inbox read.
 */
final readonly class ReadMessagesController
{
    public function __invoke(ReadMessagesCall $call, CommandBus $commands): MessagesRead
    {
        $batch = $commands->run(new ReadMessagesCommand($call->inboxId, $call->messageIds));

        return MessagesRead::from(['results' => array_map(
            fn (MessageReadResult $messageRead) => [
                'messageId' => $messageRead->messageId,
                'firstRead' => $messageRead->firstRead,
                'takenUp' => $messageRead->takenUp,
            ],
            $batch->messageReads,
        )]);
    }
}
