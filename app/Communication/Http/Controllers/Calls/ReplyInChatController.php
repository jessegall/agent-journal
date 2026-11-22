<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessageNamed;
use App\Communication\Calls\ReplyInChatCall;
use App\Communication\Commands\ReplyInChat;

/**
 * Replies to a message in one of your chats.
 */
final readonly class ReplyInChatController
{
    public function __invoke(ReplyInChatCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new ReplyInChat($call->parentId, $call->body, $call->requestKey->value, $call->inboxId));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
