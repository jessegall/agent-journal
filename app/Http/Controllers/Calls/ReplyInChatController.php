<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessageNamed;
use App\Calls\Communication\ReplyInChatCall;
use App\Commands\ReplyInChat\ReplyInChatCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Replies to a message in one of your chats.
 */
final readonly class ReplyInChatController
{
    public function __invoke(ReplyInChatCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new ReplyInChatCommand(
            $call->parentId,
            $call->body,
            $call->requestKey->value,
            $call->inboxId,
            $call->claimToken,
        ));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
