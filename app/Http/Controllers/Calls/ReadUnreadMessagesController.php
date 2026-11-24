<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\ReadUnreadMessagesCall;
use App\Calls\Communication\UnreadMessages;
use App\Commands\Messages\ReadUnreadMessages\ReadUnreadMessagesCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Reads the caller's unread messages and records each read.
 */
final readonly class ReadUnreadMessagesController
{
    public function __invoke(ReadUnreadMessagesCall $call, CommandBus $commands): UnreadMessages
    {
        return new UnreadMessages($commands->run(new ReadUnreadMessagesCommand()));
    }
}
