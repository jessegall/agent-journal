<?php

declare(strict_types=1);

namespace App\Communication\Http\Controllers\Calls;

use App\Bus\Contracts\CommandBus;
use App\Communication\Calls\AskMessageCall;
use App\Communication\Calls\MessageNamed;
use App\Communication\Commands\AskMessage\AskMessageCommand;

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
