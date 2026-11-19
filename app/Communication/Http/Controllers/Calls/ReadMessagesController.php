<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessagesRead;
use App\Communication\Calls\ReadMessagesCall;
use App\Communication\Commands\ReadMessages;
use App\Communication\Data\MessageReadResult;

/**
 * Marks messages of an inbox read.
 */
final readonly class ReadMessagesController
{
    public function __invoke(ReadMessagesCall $call, CommandBus $commands): MessagesRead
    {
        $batch = $commands->run(new ReadMessages($call->inboxId, $call->messageIds));

        return MessagesRead::from(['results' => array_map(
            fn (MessageReadResult $result) => [
                'messageId' => $result->messageId,
                'firstRead' => $result->firstRead,
                'takenUp' => $result->takenUp,
            ],
            $batch->results,
        )]);
    }
}
