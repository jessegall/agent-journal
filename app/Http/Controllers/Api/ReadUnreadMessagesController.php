<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Api\Communication\ReadUnreadMessagesPayload;
use App\Api\Api\Communication\UnreadMessages;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Messages\Commands\ReadUnreadMessages\ReadUnreadMessagesCommand;
use App\Messages\Data\MessageView;

/**
 * Reads the caller's unread messages and records each read.
 */
final readonly class ReadUnreadMessagesController
{
    #[Dispatches(ReadUnreadMessagesCommand::class)]
    public function __invoke(ReadUnreadMessagesPayload $call, CommandBus $commands): UnreadMessages
    {
        $shown = $commands->run(new ReadUnreadMessagesCommand());

        return new UnreadMessages(array_map(MessageView::of(...), $shown->messages));
    }
}
