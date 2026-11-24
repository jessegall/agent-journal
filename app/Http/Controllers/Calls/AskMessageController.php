<?php

declare(strict_types=1);

namespace App\Http\Controllers\Calls;

use App\Calls\Communication\AskMessageCall;
use App\Calls\Communication\MessageNamed;
use App\Commands\Messages\AskMessage\AskMessageCommand;
use App\Contracts\Bus\CommandBus;

/**
 * Sends a message that asks for an answer.
 */
final readonly class AskMessageController
{
    public function __invoke(AskMessageCall $call, CommandBus $commands): MessageNamed
    {
        $message = $call->message;
        $command = new AskMessageCommand($message->sourceInboxId, $message->destinationInboxId, $message->body);
        $messageId = $commands->run($command);

        return MessageNamed::from(['messageId' => $messageId]);
    }
}
