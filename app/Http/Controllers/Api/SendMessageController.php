<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Communication\MessageNamed;
use App\Api\Communication\SendMessagePayload;
use App\Commands\Messages\SendMessage\SendMessageCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Sends a message from one of your inboxes to another inbox.
 */
final readonly class SendMessageController
{
    public function __invoke(SendMessagePayload $call, CommandBus $commands): MessageNamed
    {
        $message = $call->message;
        $command = new SendMessageCommand($message->inboxId, $message->body, $message->targetMessageNumber);
        $messageId = $commands->run($command);

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
