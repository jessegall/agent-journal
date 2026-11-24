<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessagesRead;
use App\Calls\Communication\ReadMessagesCall;
use App\Commands\Messages\ReadMessages\ReadMessagesCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Messages\MessageReadResult;

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
                'firstRead' => $messageRead->isFirstRead,
                'claimed' => $messageRead->isClaimed,
            ],
            $batch->messageReads,
        )]);
    }
}
