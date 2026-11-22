<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessagesRead;
use App\Communication\Calls\ReadMessagesCall;
use App\Communication\Commands\ReadMessages\ReadMessagesCommand;
use App\Communication\Data\MessageReadResult;

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
