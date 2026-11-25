<?php

declare(strict_types=1);

namespace App\Http\Controllers\Api;

use App\Api\Communication\ReadMessagePayload;
use App\Commands\Messages\ReadMessage\ReadMessageCommand;
use App\Contracts\Bus\CommandBus;
use App\Data\Messages\MessageView;

/**
 * Reads one message and records the read.
 */
final readonly class ReadMessageController
{
    public function __invoke(ReadMessagePayload $call, CommandBus $commands): MessageView
    {
        $message = $commands->run(new ReadMessageCommand($call->messageId));

        return MessageView::of($message);
    }
}
