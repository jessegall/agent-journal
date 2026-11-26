<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Api\Communication\MessageNamed;
use App\Api\Api\Communication\SendMessagePayload;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Messages\Commands\SendMessage\SendMessageCommand;

/**
 * Sends a message from one of your inboxes to another inbox.
 */
final readonly class SendMessageController
{
    #[Dispatches(SendMessageCommand::class)]
    public function __invoke(SendMessagePayload $call, CommandBus $commands): MessageNamed
    {
        $message = $call->message;
        $command = new SendMessageCommand($message->inboxId, $message->body, $message->targetMessageNumber);
        $messageId = $commands->run($command);

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
