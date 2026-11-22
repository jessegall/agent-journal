<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessageNamed;
use App\Communication\Calls\ReplyInChatCall;
use App\Communication\Commands\ReplyInChat\ReplyInChatCommand;

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
