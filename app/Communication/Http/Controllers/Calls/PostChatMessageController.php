<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessageNamed;
use App\Communication\Calls\PostChatMessageCall;
use App\Communication\Commands\PostChatMessage;

/**
 * Posts a message in one of your chats.
 */
final readonly class PostChatMessageController
{
    public function __invoke(PostChatMessageCall $call, CommandBus $commands): MessageNamed
    {
        $messageId = $commands->run(new PostChatMessage(
            $call->inboxId,
            $call->body,
            $call->requestKey->value,
            $call->claimToken,
        ));

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
