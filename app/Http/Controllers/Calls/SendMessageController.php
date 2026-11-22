<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\MessageNamed;
use App\Calls\Communication\SendMessageCall;
use App\Commands\SendMessage\SendMessageCommand;
use App\Contracts\CommandBus;

/**
 * Sends a message from one of your inboxes to another inbox.
 */
final readonly class SendMessageController
{
    public function __invoke(SendMessageCall $call, CommandBus $commands): MessageNamed
    {
        $message = $call->message;
        $command = new SendMessageCommand($message->sourceInboxId, $message->destinationInboxId, $message->body);
        $messageId = $commands->run($command);

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
