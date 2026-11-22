<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessageNamed;
use App\Calls\Communication\PostChatMessageCall;
use App\Commands\PostChatMessage\PostChatMessageCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Posts a message in one of your chats.
 */
final readonly class PostChatMessageController
{
    public function __invoke(PostChatMessageCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new PostChatMessageCommand(
            $call->inboxId,
            $call->body,
            $call->requestKey->value,
            $call->claimToken,
        ));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
