<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessagesRead;
use App\Communication\Calls\TakeNextMessagesCall;
use App\Communication\Commands\TakeNextMessages;
use App\Communication\Data\MessageReadResult;

/**
 * Takes up the next unclaimed messages of an inbox.
 */
final readonly class TakeNextMessagesController
{
    public function __invoke(TakeNextMessagesCall $call, CommandBus $commands): MessagesRead
    {
        $batch = $commands->run(new TakeNextMessages($call->inboxId, $call->limit));

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
