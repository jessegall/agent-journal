<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\MessageNamed;
use App\Communication\Calls\SendMessageCall;
use App\Communication\Commands\SendMessage\SendMessageCommand;

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
