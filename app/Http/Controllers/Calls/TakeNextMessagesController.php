<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessagesRead;
use App\Calls\Communication\TakeNextMessagesCall;
use App\Commands\TakeNextMessages\TakeNextMessagesCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Messages\MessageReadResult;

/**
 * Takes up the next unclaimed messages of an inbox.
 */
final readonly class TakeNextMessagesController
{
    public function __invoke(TakeNextMessagesCall $call, CommandBus $commands): MessagesRead
    {
        $batch = $commands->run(new TakeNextMessagesCommand($call->inboxId, $call->limit));

        return MessagesRead::from(['results' => array_map(
            fn (MessageReadResult $messageRead) => [
                'messageId' => $messageRead->messageId,
                'firstRead' => $messageRead->firstRead,
                'claimed' => $messageRead->claimed,
            ],
            $batch->messageReads,
        )]);
    }
}
