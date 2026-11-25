<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\ReadUnreadMessagesCall;
use App\Calls\Communication\UnreadMessages;
use App\Commands\Messages\ReadUnreadMessages\ReadUnreadMessagesCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Messages\MessageView;

/**
 * Reads the caller's unread messages and records each read.
 */
final readonly class ReadUnreadMessagesController
{
    public function __invoke(ReadUnreadMessagesCall $call, CommandBus $commands): UnreadMessages
    {
        $shown = $commands->run(new ReadUnreadMessagesCommand());

        return new UnreadMessages(array_map(MessageView::of(...), $shown->messages));
    }
}
