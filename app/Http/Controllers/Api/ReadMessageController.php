<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Communication\ReadMessagePayload;
use App\Bus\Attributes\Dispatches;
use App\Bus\Contracts\CommandBus;
use App\Messages\Commands\ReadMessage\ReadMessageCommand;
use App\Messages\Data\MessageView;

/**
 * Reads one message and records the read.
 */
final readonly class ReadMessageController
{
    #[Dispatches(ReadMessageCommand::class)]
    public function __invoke(ReadMessagePayload $call, CommandBus $commands): MessageView
    {
        $message = $commands->run(new ReadMessageCommand($call->messageId));

        return MessageView::from($message);
    }
}
